/* eslint-disable @typescript-eslint/no-implied-eval */
import { Window } from 'happy-dom-without-node'

export const executeScripts = (rawHtml: string, scripts: readonly string[]): any => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window

  // Parse the raw HTML into the happy-dom document
  document.documentElement.innerHTML = rawHtml

  // Execute each script with the happy-dom window and document as context
  for (const scriptContent of scripts) {
    try {
      const fn = new Function('window', 'document', 'console', scriptContent)
      fn(window, document, console)
    } catch (error) {
      console.warn('[preview-worker] Script execution error:', error)
    }
  }

  return document
}
