/**
 * HNSW Index (Hierarchical Navigable Small World)
 * Pure JavaScript implementation of ANN (Approximate Nearest Neighbors)
 *
 * Based on the paper: "Efficient and robust approximate nearest neighbor search using HNSW graphs"
 * https://arxiv.org/abs/1603.09320
 *
 * Features:
 * - Multi-layer graph structure for efficient search
 * - Incremental insertion (no need to rebuild index)
 * - Configurable accuracy/speed tradeoff
 * - Serializable for persistence
 */

/**
 * Cosine similarity (raw value -1 to 1)
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} Similarity score (-1 to 1, higher is more similar)
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return -1;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);

  if (magnitude === 0) {
    return -1;
  }

  // Return raw cosine similarity (-1 to 1)
  return dotProduct / magnitude;
}

/**
 * Distance function (1 - cosine similarity)
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} Distance (0-2, lower is more similar)
 */
function distance(vecA, vecB) {
  return 1 - cosineSimilarity(vecA, vecB);
}

/**
 * Min-Heap implementation for efficient nearest neighbor tracking
 */
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(distance, id) {
    this.heap.push({ distance, id });
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return top;
  }

  peek() {
    return this.heap[0] || null;
  }

  size() {
    return this.heap.length;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].distance >= this.heap[parentIndex].distance) break;
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  _bubbleDown(index) {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (leftChild < this.heap.length && this.heap[leftChild].distance < this.heap[smallest].distance) {
        smallest = leftChild;
      }
      if (rightChild < this.heap.length && this.heap[rightChild].distance < this.heap[smallest].distance) {
        smallest = rightChild;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

/**
 * Max-Heap for tracking candidate neighbors
 */
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  push(distance, id) {
    this.heap.push({ distance, id });
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return top;
  }

  peek() {
    return this.heap[0] || null;
  }

  size() {
    return this.heap.length;
  }

  toArray() {
    return [...this.heap].sort((a, b) => a.distance - b.distance);
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].distance <= this.heap[parentIndex].distance) break;
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  _bubbleDown(index) {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let largest = index;

      if (leftChild < this.heap.length && this.heap[leftChild].distance > this.heap[largest].distance) {
        largest = leftChild;
      }
      if (rightChild < this.heap.length && this.heap[rightChild].distance > this.heap[largest].distance) {
        largest = rightChild;
      }
      if (largest === index) break;

      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
}

/**
 * HNSW Index Class
 */
export class HNSWIndex {
  constructor(options = {}) {
    // HNSW parameters
    this.M = options.M || 16;                    // Number of bi-directional links per node
    this.efConstruction = options.efConstruction || 200;  // Size of dynamic candidate list during construction
    this.efSearch = options.efSearch || 50;      // Size of dynamic candidate list during search
    this.ml = 1 / Math.log(2);                   // Level multiplier for exponential distribution

    // Data structures
    this.vectors = new Map();     // id -> vector
    this.layers = new Map();      // id -> max layer
    this.graph = new Map();       // id -> { layer -> Set of neighbor ids }
    this.entryPoint = null;       // id of entry point (top layer)
    this.dimension = null;        // Vector dimension (auto-detected)
    this.size = 0;                // Number of vectors

    console.log('[HNSW] Index created with params:', {
      M: this.M,
      efConstruction: this.efConstruction,
      efSearch: this.efSearch
    });
  }

  /**
   * Get random layer using exponential distribution
   * @returns {number}
   */
  _getRandomLayer() {
    return Math.floor(-Math.log(Math.random()) * this.ml);
  }

  /**
   * Add a vector to the index
   * @param {string} id - Unique identifier
   * @param {number[]} vector - Embedding vector
   */
  add(id, vector) {
    if (!vector || !Array.isArray(vector)) {
      throw new Error('[HNSW] Vector must be a non-empty array');
    }

    // Auto-detect dimension from first vector
    if (this.dimension === null) {
      this.dimension = vector.length;
      console.log('[HNSW] Dimension auto-detected:', this.dimension);
    } else if (vector.length !== this.dimension) {
      throw new Error(`[HNSW] Vector dimension mismatch: expected ${this.dimension}, got ${vector.length}`);
    }

    // Store vector
    this.vectors.set(id, vector);

    // If this is the first node, make it the entry point
    if (this.size === 0) {
      const layer = this._getRandomLayer();
      this.layers.set(id, layer);
      this.entryPoint = id;
      this.graph.set(id, new Map());
      for (let lc = 0; lc <= layer; lc++) {
        this.graph.get(id).set(lc, new Set());
      }
      this.size++;
      console.log('[HNSW] First node added as entry point:', id, 'layer:', layer);
      return;
    }

    // Determine layer for new node
    const layer = this._getRandomLayer();
    this.layers.set(id, layer);

    // Initialize graph for new node
    this.graph.set(id, new Map());
    for (let lc = 0; lc <= layer; lc++) {
      this.graph.get(id).set(lc, new Set());
    }

    // Search for nearest neighbors at all layers
    let currentNearest = this.entryPoint;
    const entryPointLayer = this.layers.get(this.entryPoint);

    // Search from top layer down to layer + 1 (greedy search)
    for (let lc = entryPointLayer; lc > layer; lc--) {
      currentNearest = this._searchLayer(vector, [currentNearest], 1, lc)[0].id;
    }

    // Search and insert from layer down to 0
    for (let lc = layer; lc >= 0; lc--) {
      const candidates = this._searchLayer(vector, [currentNearest], this.efConstruction, lc);

      // Select M nearest neighbors
      const M = lc === 0 ? this.M * 2 : this.M;
      const neighbors = this._selectNeighbors(candidates, M);

      // Add bidirectional links
      for (const neighbor of neighbors) {
        // Add link from new node to neighbor
        this.graph.get(id).get(lc).add(neighbor.id);

        // Add link from neighbor to new node (only if neighbor has this layer)
        const neighborLayers = this.graph.get(neighbor.id);
        if (neighborLayers && neighborLayers.has(lc)) {
          neighborLayers.get(lc).add(id);

          // Prune neighbors if needed
          const neighborConnections = neighborLayers.get(lc);
          if (neighborConnections.size > M) {
            this._pruneConnections(neighbor.id, lc, M);
          }
        }
      }

      currentNearest = neighbors[0].id;
    }

    // Update entry point if new node has higher layer
    if (layer > entryPointLayer) {
      this.entryPoint = id;
    }

    this.size++;
  }

  /**
   * Search layer for nearest neighbors
   * @param {number[]} queryVector
   * @param {string[]} entryPoints - Array of node IDs to start search
   * @param {number} ef - Size of dynamic candidate list
   * @param {number} layer
   * @returns {Array<{distance, id}>}
   */
  _searchLayer(queryVector, entryPoints, ef, layer) {
    const visited = new Set();
    const candidates = new MaxHeap(); // Max heap for exploration (pop farthest first)
    const nearest = new MaxHeap();     // Max heap to track K nearest (pop farthest to keep closest)

    // Initialize with entry points
    for (const id of entryPoints) {
      const dist = distance(queryVector, this.vectors.get(id));
      candidates.push(dist, id);
      nearest.push(dist, id);
      visited.add(id);
    }

    while (candidates.size() > 0) {
      const current = candidates.pop();
      const farthest = nearest.peek();

      if (current.distance > farthest.distance && nearest.size() >= ef) {
        break; // No closer nodes possible
      }

      // Check all neighbors at this layer
      const neighbors = this.graph.get(current.id).get(layer) || new Set();
      for (const neighborId of neighbors) {
        if (visited.has(neighborId)) continue;
        visited.add(neighborId);

        const dist = distance(queryVector, this.vectors.get(neighborId));
        const farthest = nearest.peek();

        if (dist < farthest.distance || nearest.size() < ef) {
          candidates.push(dist, neighborId);
          nearest.push(dist, neighborId);

          // Keep only ef nearest (remove farthest)
          if (nearest.size() > ef) {
            nearest.pop(); // Removes element with highest distance (farthest)
          }
        }
      }
    }

    // Convert heap to sorted array (ascending distance)
    return nearest.toArray(); // Already sorted by toArray()
  }

  /**
   * Select M neighbors using heuristic (prefer diverse neighbors)
   * @param {Array<{distance, id}>} candidates
   * @param {number} M
   * @returns {Array<{distance, id}>}
   */
  _selectNeighbors(candidates, M) {
    if (candidates.length <= M) {
      return candidates;
    }

    // Simple strategy: return M closest neighbors
    return candidates.slice(0, M);
  }

  /**
   * Prune connections for a node to keep only M best
   * @param {string} id
   * @param {number} layer
   * @param {number} M
   */
  _pruneConnections(id, layer, M) {
    const connections = this.graph.get(id).get(layer);
    if (connections.size <= M) return;

    const vector = this.vectors.get(id);
    const neighbors = Array.from(connections).map(neighborId => ({
      id: neighborId,
      distance: distance(vector, this.vectors.get(neighborId))
    }));

    neighbors.sort((a, b) => a.distance - b.distance);

    // Keep only M closest
    const toKeep = new Set(neighbors.slice(0, M).map(n => n.id));
    const toRemove = Array.from(connections).filter(nId => !toKeep.has(nId));

    // Remove bidirectional links
    for (const neighborId of toRemove) {
      connections.delete(neighborId);

      // Remove reverse link (only if neighbor has this layer)
      const neighborLayers = this.graph.get(neighborId);
      if (neighborLayers && neighborLayers.has(layer)) {
        neighborLayers.get(layer).delete(id);
      }
    }
  }

  /**
   * Search for K nearest neighbors
   * @param {number[]} queryVector
   * @param {number} k - Number of neighbors to return
   * @param {number} ef - Search quality (higher = better accuracy, slower)
   * @returns {Array<{id, distance, similarity}>}
   */
  search(queryVector, k = 10, ef = null) {
    if (this.size === 0) {
      return [];
    }

    if (queryVector.length !== this.dimension) {
      throw new Error(`[HNSW] Query vector dimension mismatch: expected ${this.dimension}, got ${queryVector.length}`);
    }

    const searchEf = ef || Math.max(this.efSearch, k);

    // Start from entry point
    let currentNearest = this.entryPoint;
    const entryPointLayer = this.layers.get(this.entryPoint);

    // Search from top layer down to 1 (greedy search)
    for (let lc = entryPointLayer; lc > 0; lc--) {
      currentNearest = this._searchLayer(queryVector, [currentNearest], 1, lc)[0].id;
    }

    // Search layer 0 with ef candidates
    const candidates = this._searchLayer(queryVector, [currentNearest], searchEf, 0);

    // Return top k, convert distance to similarity
    return candidates.slice(0, k).map(item => ({
      id: item.id,
      distance: item.distance,
      similarity: 1 - item.distance  // Convert distance back to similarity
    }));
  }

  /**
   * Remove a vector from the index
   * @param {string} id
   */
  remove(id) {
    if (!this.vectors.has(id)) {
      return;
    }

    const layer = this.layers.get(id);

    // Remove all connections
    for (let lc = 0; lc <= layer; lc++) {
      const neighbors = this.graph.get(id).get(lc);
      for (const neighborId of neighbors) {
        this.graph.get(neighborId).get(lc).delete(id);
      }
    }

    // Remove from data structures
    this.vectors.delete(id);
    this.layers.delete(id);
    this.graph.delete(id);
    this.size--;

    // Update entry point if necessary
    if (this.entryPoint === id && this.size > 0) {
      // Find new entry point (node with highest layer)
      let maxLayer = -1;
      let newEntryPoint = null;
      for (const [nodeId, nodeLayer] of this.layers) {
        if (nodeLayer > maxLayer) {
          maxLayer = nodeLayer;
          newEntryPoint = nodeId;
        }
      }
      this.entryPoint = newEntryPoint;
    }
  }

  /**
   * Serialize index to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      M: this.M,
      efConstruction: this.efConstruction,
      efSearch: this.efSearch,
      dimension: this.dimension,
      size: this.size,
      entryPoint: this.entryPoint,
      vectors: Array.from(this.vectors.entries()),
      layers: Array.from(this.layers.entries()),
      graph: Array.from(this.graph.entries()).map(([id, layerMap]) => [
        id,
        Array.from(layerMap.entries()).map(([layer, neighbors]) => [
          layer,
          Array.from(neighbors)
        ])
      ])
    };
  }

  /**
   * Deserialize index from JSON
   * @param {Object} data
   * @returns {HNSWIndex}
   */
  static fromJSON(data) {
    const index = new HNSWIndex({
      M: data.M,
      efConstruction: data.efConstruction,
      efSearch: data.efSearch
    });

    index.dimension = data.dimension;
    index.size = data.size;
    index.entryPoint = data.entryPoint;
    index.vectors = new Map(data.vectors);
    index.layers = new Map(data.layers);

    // Reconstruct graph
    for (const [id, layerArray] of data.graph) {
      const layerMap = new Map();
      for (const [layer, neighbors] of layerArray) {
        layerMap.set(layer, new Set(neighbors));
      }
      index.graph.set(id, layerMap);
    }

    console.log('[HNSW] Index loaded from JSON:', {
      dimension: index.dimension,
      size: index.size,
      M: index.M
    });

    return index;
  }

  /**
   * Get index statistics
   * @returns {Object}
   */
  getStats() {
    const layerDistribution = new Map();
    for (const layer of this.layers.values()) {
      layerDistribution.set(layer, (layerDistribution.get(layer) || 0) + 1);
    }

    return {
      size: this.size,
      dimension: this.dimension,
      M: this.M,
      efConstruction: this.efConstruction,
      efSearch: this.efSearch,
      entryPoint: this.entryPoint,
      entryPointLayer: this.entryPoint ? this.layers.get(this.entryPoint) : null,
      layerDistribution: Object.fromEntries(layerDistribution)
    };
  }
}
