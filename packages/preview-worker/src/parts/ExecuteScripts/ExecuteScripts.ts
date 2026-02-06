/* eslint-disable @typescript-eslint/no-implied-eval */
import { getTopLevelFunctionNames } from '../GetTopLevelFunctionNames/GetTopLevelFunctionNames.ts'

export const executeScripts = (window: any, document: any, scripts: readonly string[]): void => {
  // Execute each script with the happy-dom window and document as context
  for (const scriptContent of scripts) {
    try {
      // In a browser, top-level function declarations in <script> tags become
      // properties on window. Since new Function() creates a local scope, we
      // extract function names and explicitly assign them to window after execution.
      const functionNames = getTopLevelFunctionNames(scriptContent)
      const suffix = functionNames.map((name) => `\nwindow['${name}'] = ${name};`).join('')
      const fn = new Function('window', 'document', 'console', scriptContent + suffix)
      fn(window, document, console)
    } catch (error) {
      console.warn('[preview-worker] Script execution error:', error)
    }
  }
}
