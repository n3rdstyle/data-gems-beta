/**
 * Build script for Offscreen Document Bundle
 * Bundles Transformers.js and embedding logic
 *
 * Note: offscreen.js source file is missing, using existing bundle
 */

import * as esbuild from 'esbuild';
import { existsSync } from 'fs';

const sourceFile = 'offscreen.js';

// Check if source file exists
if (!existsSync(sourceFile)) {
  console.log('⏭️  Offscreen source file not found, skipping build (using existing bundle)');
  process.exit(0);
}

const banner = `// Offscreen Document Bundle - Auto-generated
// DO NOT EDIT MANUALLY
`;

try {
  await esbuild.build({
    entryPoints: [sourceFile],
    bundle: true,
    format: 'iife',
    outfile: 'offscreen.bundle.js',
    banner: { js: banner },
    platform: 'browser',
    target: 'es2020',
    minify: false, // Keep readable for debugging
    sourcemap: false
  });

  console.log('✅ Offscreen bundle built successfully');
} catch (error) {
  console.error('❌ Offscreen bundle build failed:', error);
  process.exit(1);
}
