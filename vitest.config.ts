import ts from 'typescript'
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

const decoratorSyntax = /^\s*@[A-Za-z_$][\w$]*/m

/**
 * Transform standard TypeScript decorators before Vite's default parser sees
 * source files (the aside gateway uses `@Remote`). Mirrors the DeepSeek
 * Harness monorepo's `vitest.shared.ts` plugin.
 */
function standardDecoratorPlugin() {
  return {
    name: 'dsh-standard-decorators',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      const file = id.split('?', 1)[0]!
      if (!/\.[cm]?tsx?$/.test(file) || !decoratorSyntax.test(code)) return
      const result = ts.transpileModule(code, {
        fileName: file,
        compilerOptions: {
          target: ts.ScriptTarget.ES2024,
          module: ts.ModuleKind.ESNext,
          jsx: file.endsWith('x') ? ts.JsxEmit.ReactJSX : undefined,
          sourceMap: true,
        },
      })
      return {
        code: result.outputText.replace(/\n?\/\/# sourceMappingURL=.*$/u, '\n'),
        map: result.sourceMapText,
      }
    },
  }
}

export default defineConfig({
  plugins: [standardDecoratorPlugin()],
  test: {
    setupFiles: [fileURLToPath(new URL('./tests/setup-browser-storage.ts', import.meta.url))],
    // Inline the @deepseek-ai dependency tree so Vite's transform pipeline
    // (not Node's ESM loader) processes it — built libs import stylesheets
    // (katex) and .ts sources that Node cannot load directly. Vite stubs
    // .css imports in tests.
    server: {
      deps: {
        inline: [/@deepseek-ai\//],
      },
    },
    // Client component specs opt into jsdom via the per-file
    // `@vitest-environment jsdom` pragma; host specs run in node.
    // Both patterns keep `pnpm -r test` (run from each package dir) working.
    include: [
      'packages/*/*/tests/**/*.spec.{ts,tsx}',
      'tests/**/*.spec.{ts,tsx}',
    ],
  },
})
