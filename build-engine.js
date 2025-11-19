/**
 * Build script for Context Engine Bundle
 * Bundles all engine modules into a single file for the extension
 */

import * as esbuild from 'esbuild';

const banner = `// Context Engine Bundle - Auto-generated
// DO NOT EDIT MANUALLY
`;

try {
  await esbuild.build({
    entryPoints: ['engine/bridge.js'],
    bundle: true,
    format: 'iife',
    globalName: 'ContextEngineBridge',
    outfile: 'engine-bridge.bundle.js',
    banner: { js: banner },
    platform: 'browser',
    target: 'es2020',
    minify: false, // Keep readable for debugging
    sourcemap: false
  });

  console.log('✅ Engine bundle built successfully');
} catch (error) {
  console.error('❌ Engine bundle build failed:', error);
  process.exit(1);
}
