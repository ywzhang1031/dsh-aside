import { defineConfig } from 'tsdown'
import { typertPlugin } from '@deepseek-ai/dsh-typert-generator/tsdown'

/**
 * Standalone host build: bundle the tsc-emitted entries and run the Typert
 * generator in package mode (emits lib/typert.host.* and
 * lib/typert.remote-client.* for the browser Remote stub).
 */
export default defineConfig({
  name: '@ywzhang1031/dsh-aside-host',
  entry: ['lib/types/{index,invariant}.js'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  clean: false,
  plugins: [typertPlugin({ mode: 'package', faces: ['host'] })],
})
