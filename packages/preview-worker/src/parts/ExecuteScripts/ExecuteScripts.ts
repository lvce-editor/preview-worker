/* eslint-disable @typescript-eslint/no-implied-eval */
import { createWindow } from '../CreateWindow/CreateWindow.ts'

export interface ExecuteScriptsResult {
  readonly document: any
  readonly window: any
}

export { createWindow } from '../CreateWindow/CreateWindow.ts'

export const executeScripts = (window: any, document: any, scripts: readonly string[]): void => {
  // Execute each script with the happy-dom window and document as context
  for (const scriptContent of scripts) {
    try {
      const fn = new Function('window', 'document', 'console', scriptContent)
      fn(window, document, console)
    } catch (error) {
      console.warn('[preview-worker] Script execution error:', error)
    }
  }
}

export const createWindowAndExecuteScripts = (rawHtml: string, scripts: readonly string[]): ExecuteScriptsResult => {
  const { document, window } = createWindow(rawHtml)
  executeScripts(window, document, scripts)
  return { document, window }
}
