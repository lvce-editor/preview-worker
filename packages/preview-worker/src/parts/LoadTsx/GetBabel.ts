import type { BabelStandalone } from './BabelStandalone.ts'
import { getCachedText } from './GetCachedText.ts'

const BABEL_CDN_URL = 'https://unpkg.com/@babel/standalone@7/babel.min.js'

let babelPromise: Promise<BabelStandalone> | undefined

export const getBabel = async (): Promise<BabelStandalone> => {
  if (babelPromise) {
    return babelPromise
  }

  babelPromise = (async (): Promise<BabelStandalone> => {
    const source = await getCachedText(BABEL_CDN_URL)
    const blob = new Blob([source], { type: 'text/javascript' })
    const blobUrl = URL.createObjectURL(blob)
    await import(/* @vite-ignore */ blobUrl)
    URL.revokeObjectURL(blobUrl)
    const babel = globalThis.Babel as BabelStandalone | undefined
    if (!babel || typeof babel.transform !== 'function') {
      throw new Error('Failed to load Babel standalone runtime')
    }
    return babel
  })()

  return babelPromise
}
