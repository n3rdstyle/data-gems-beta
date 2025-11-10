/**
 * Offscreen Document for Embeddings
 * Runs Transformers.js in a hidden document (supports WASM)
 */

import { pipeline, env } from '@xenova/transformers';

console.log('[Offscreen] Embedder loading...');

// Configure Transformers.js
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = 1; // Single-threaded (no Web Workers needed)

let embedder = null;

/**
 * Initialize embedder
 */
async function initializeEmbedder() {
  if (embedder) return embedder;

  console.log('[Offscreen] Initializing Transformers.js embedder...');

  try {
    embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
      {
        // Disable multi-threading to avoid Web Worker CSP issues
        device: 'wasm',
        dtype: 'fp32'
      }
    );

    console.log('[Offscreen] Embedder ready!');
    return embedder;
  } catch (error) {
    console.error('[Offscreen] Failed to initialize embedder:', error);
    throw error;
  }
}

/**
 * Generate embedding for text
 */
async function generateEmbedding(text) {
  if (!embedder) {
    await initializeEmbedder();
  }

  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true
  });

  return Array.from(output.data);
}

/**
 * Listen for messages from Service Worker
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'offscreen') return;

  console.log('[Offscreen] Received message:', message.type);

  if (message.type === 'generateEmbedding') {
    generateEmbedding(message.text)
      .then(embedding => {
        sendResponse({ success: true, embedding });
      })
      .catch(error => {
        console.error('[Offscreen] Error generating embedding:', error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Keep channel open for async response
  }

  if (message.type === 'ping') {
    sendResponse({ success: true, ready: !!embedder });
    return false;
  }
});

// Auto-initialize on load
initializeEmbedder().catch(error => {
  console.error('[Offscreen] Auto-init failed:', error);
});

console.log('[Offscreen] Ready for embedding requests');
