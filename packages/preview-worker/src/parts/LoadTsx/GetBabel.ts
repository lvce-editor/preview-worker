import type { BabelStandalone } from './BabelStandalone.ts'
import { getCachedText } from './GetCachedText.ts'

const BABEL_CDN_URL = 'https://unpkg.com/@babel/standalone@7/babel.min.js'

const state: { babelPromise: Promise<BabelStandalone> | undefined } = { babelPromise: undefined }

export const getBabel = async (): Promise<BabelStandalone> => {
  if (state.babelPromise) {
    return state.babelPromise
  }

  state.babelPromise = (async (): Promise<BabelStandalone> => {
    const source = await getCachedText(BABEL_CDN_URL)
    const blob = new Blob([source], { type: 'text/javascript' })
    const blobUrl = URL.createObjectURL(blob)
    await import(/* @vite-ignore */ blobUrl)
    URL.revokeObjectURL(blobUrl)
    const babel = (globalThis as typeof globalThis & { Babel?: BabelStandalone }).Babel
    if (!babel || typeof babel.transform !== 'function') {
      throw new Error('Failed to load Babel standalone runtime')
    }
    return babel
  })()

  return state.babelPromise
}
