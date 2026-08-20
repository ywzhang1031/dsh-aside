import { defineConfig } from 'tsdown'

/**
 * Standalone host build: bundle the tsc-emitted runtime, invariant, and
 * package-owned Typert contract entries. The official generator depends on
 * the complete DSH monorepo project-reference graph, so this independent
 * plugin publishes its small Remote descriptor directly against the public
 * Typert protocol instead.
 */
export default defineConfig({
  name: 'dsh-aside-host',
  entry: ['lib/types/{index,invariant,typert.host,typert.remote-client}.js'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  clean: false,
  outputOptions: {
    chunkFileNames: 'typert-contract.js',
  },
})
