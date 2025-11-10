/**
 * Build script for Offscreen Document Bundle
 * Bundles Transformers.js for WASM embedding generation
 */

import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('[Build] Building Offscreen bundle...');

try {
  await esbuild.build({
    entryPoints: [join(__dirname, 'offscreen.js')],
    bundle: true,
    format: 'iife',
    outfile: join(__dirname, 'offscreen.bundle.js'),
    platform: 'browser',
    target: 'es2020',
    minify: false,
    sourcemap: false,
    loader: {
      '.wasm': 'file',
      '.onnx': 'file'
    },
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    banner: {
      js: '// Offscreen Embedder Bundle - Auto-generated\n// DO NOT EDIT MANUALLY\n'
    }
  });

  console.log('[Build] ✓ Bundle created: offscreen.bundle.js');
} catch (error) {
  console.error('[Build] ✗ Build failed:', error);
  process.exit(1);
}
