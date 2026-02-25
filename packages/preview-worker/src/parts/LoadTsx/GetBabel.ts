import type { BabelStandalone } from './BabelStandalone.ts'
import { getCachedText } from './GetCachedText.ts'

const BABEL_CDN_URL = 'https://unpkg.com/@babel/standalone@7/babel.min.js'

let babelPromise: Promise<BabelStandalone> | undefined

export const getBabel = async (): Promise<BabelStandalone> => {
  if (babelPromise) {
    return babelPromise
  }

  babelPromise = (async () => {
    const source = await getCachedText(BABEL_CDN_URL)
    const load = new Function('globalThis', `${source}\nreturn globalThis.Babel;`)
    const babel = load(globalThis) as BabelStandalone | undefined
    if (!babel || typeof babel.transform !== 'function') {
      throw new Error('Failed to load Babel standalone runtime')
    }
    return babel
  })()

  return babelPromise
}
