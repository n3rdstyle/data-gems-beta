/**
 * RxDB Database Configuration
 * Context Engine v2 - Storage Layer
 *
 * Sets up RxDB with IndexedDB backend and Vector plugin for semantic search
 */

import { createRxDatabase, addRxPlugin } from '../node_modules/rxdb/dist/esm/index.js';
import { getRxStorageDexie } from '../node_modules/rxdb/dist/esm/plugins/storage-dexie/index.js';
import { RxDBQueryBuilderPlugin } from '../node_modules/rxdb/dist/esm/plugins/query-builder/index.js';
import { RxDBUpdatePlugin } from '../node_modules/rxdb/dist/esm/plugins/update/index.js';

// Add plugins
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

// Note: Dev-mode plugin disabled for Chrome Extension (CSP blocks AJV validator)

/**
 * Gem Schema for RxDB
 * Enhanced with semantic metadata and vector embeddings
 */
const gemSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    // EXISTING FIELDS
    id: {
      type: 'string',
      maxLength: 100
    },
    value: {
      type: 'string',
      maxLength: 10000
    },
    collections: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    subCollections: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    timestamp: {
      type: 'number',
      minimum: 0,
      multipleOf: 1  // Required for indexed number fields
    },

    // NEW: Semantic Metadata
    semanticType: {
      type: 'string',
      enum: ['constraint', 'preference', 'activity', 'characteristic', 'goal']
    },
    attribute: {
      type: 'string',
      maxLength: 200
    },
    attributeValue: {
      type: 'string',
      maxLength: 500
    },
    attributeUnit: {
      type: 'string',
      maxLength: 50
    },

    // NEW: Vector Embeddings (384-dim from Gemini Nano)
    vector: {
      type: 'array',
      items: {
        type: 'number'
      },
      minItems: 384,
      maxItems: 384
    },

    // NEW: Keywords for BM25 sparse search
    keywords: {
      type: 'object',
      additionalProperties: {
        type: 'number'  // word: frequency
      }
    },

    // NEW: Quality Metadata
    enrichmentVersion: {
      type: 'string',
      maxLength: 20
    },
    enrichmentTimestamp: {
      type: 'number',
      minimum: 0,
      multipleOf: 1  // Required for indexed number fields
    },
    userVerified: {
      type: 'boolean'
    }
  },
  required: ['id', 'value', 'timestamp', 'collections', 'subCollections'],  // Indexed fields must be required for Dexie
  indexes: [
    'timestamp',
    ['collections'],  // Multi-entry index for array
    ['subCollections']
  ]
};

/**
 * Database instance (singleton)
 */
let dbInstance = null;
let initPromise = null;  // Prevent race conditions

/**
 * Initialize RxDB database
 * @returns {Promise<RxDatabase>}
 */
export async function initDatabase() {
  if (dbInstance) {
    console.log('[Database] Using existing database instance');
    return dbInstance;
  }

  // If already initializing, return the same promise
  if (initPromise) {
    console.log('[Database] Initialization already in progress, waiting...');
    return initPromise;
  }

  console.log('[Database] Initializing RxDB with IndexedDB backend...');

  // Store the initialization promise
  initPromise = (async () => {

  try {
    // Create database
    const db = await createRxDatabase({
      name: 'rxdb-datagems-context',
      storage: getRxStorageDexie(),
      multiInstance: true,  // Allow multiple instances (Popup reopens each time)
      eventReduce: true  // Share events between instances
    });

    console.log('[Database] RxDB created successfully');

    // Add gems collection
    await db.addCollections({
      gems: {
        schema: gemSchema,
        // Note: Vector search plugin will be added separately
        // to avoid circular dependency issues
      }
    });

    console.log('[Database] Gems collection created');
    console.log('[Database] Schema version:', gemSchema.version);

    dbInstance = db;

    // Log database info
    console.log('[Database] Database ready:', {
      name: db.name,
      collections: Object.keys(db.collections),
      storage: 'Dexie (IndexedDB)'
    });

    return db;

  } catch (error) {
    console.error('[Database] Failed to initialize:', error);
    initPromise = null;  // Reset on error so retry is possible
    throw error;
  } finally {
    initPromise = null;  // Clear promise when done
  }
  })();

  return initPromise;
}

/**
 * Get database instance
 * @returns {RxDatabase|null}
 */
export function getDatabase() {
  return dbInstance;
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  if (dbInstance) {
    console.log('[Database] Closing database...');
    await dbInstance.destroy();
    dbInstance = null;
    console.log('[Database] Database closed');
  }
}

/**
 * Get gems collection
 * @returns {RxCollection|null}
 */
export function getGemsCollection() {
  if (!dbInstance) {
    console.warn('[Database] Database not initialized');
    return null;
  }
  return dbInstance.gems;
}

/**
 * Database statistics
 * @returns {Promise<Object>}
 */
export async function getDatabaseStats() {
  const collection = getGemsCollection();
  if (!collection) {
    return null;
  }

  // Get all gems and count in-memory (avoid $exists operator which isn't supported)
  const allGems = await collection.find().exec();
  const count = allGems.length;
  const withVectors = allGems.filter(gem => gem.vector && gem.vector.length > 0).length;
  const withSemantics = allGems.filter(gem => gem.semanticType).length;

  return {
    totalGems: count,
    gemsWithVectors: withVectors,
    gemsWithSemantics: withSemantics,
    enrichmentRate: count > 0 ? (withSemantics / count * 100).toFixed(1) : 0
  };
}

/**
 * Migration helper (for future schema updates)
 * @param {number} toVersion
 */
export async function migrateSchema(toVersion) {
  // Placeholder for future schema migrations
  console.log(`[Database] Migration to v${toVersion} requested`);
  // Implementation will be added when schema version changes
}
