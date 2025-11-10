/**
 * Build script for Context Engine Bundle
 * Bundles all engine modules including Transformers.js for Service Worker
 */

import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('[Build] Building Context Engine bundle...');

try {
  await esbuild.build({
    entryPoints: [join(__dirname, 'engine', 'bridge.js')],
    bundle: true,
    format: 'iife',
    globalName: 'ContextEngineBridge',
    outfile: join(__dirname, 'engine-bridge.bundle.js'),
    platform: 'browser',
    target: 'es2020',
    minify: false, // Keep readable for debugging
    sourcemap: false,
    loader: {
      '.wasm': 'file', // Handle WASM files
      '.onnx': 'file'  // Handle ONNX model files
    },
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    banner: {
      js: '// Context Engine Bundle - Auto-generated\n// DO NOT EDIT MANUALLY\n'
    }
  });

  console.log('[Build] ✓ Bundle created: engine-bridge.bundle.js');
} catch (error) {
  console.error('[Build] ✗ Build failed:', error);
  process.exit(1);
}
