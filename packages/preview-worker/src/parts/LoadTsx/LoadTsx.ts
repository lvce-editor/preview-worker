import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as LoadScripts from '../LoadScripts/LoadScripts.ts'

const PREVIEW_CDN_CACHE_NAME = 'preview-cdn-cache-v1'
const REACT_CDN_URL = 'https://unpkg.com/react@19/umd/react.development.js'
const REACT_DOM_CDN_URL = 'https://unpkg.com/react-dom@19/umd/react-dom.development.js'
const BABEL_CDN_URL = 'https://unpkg.com/@babel/standalone@7/babel.min.js'
const TSX_PREVIEW_HTML = '<!doctype html><html><head></head><body><div id="root"></div></body></html>'

interface BabelStandalone {
  transform: (code: string, options: object) => { readonly code?: string | null }
}

interface TsxLoadResult {
  readonly content: string
  readonly css: readonly string[]
  readonly errorMessage: string
  readonly parsedDom: PreviewState['parsedDom']
  readonly parsedNodesChildNodeCount: number
  readonly scripts: readonly string[]
  readonly styleSheets: PreviewState['styleSheets']
}

let babelPromise: Promise<BabelStandalone> | undefined

const ensureComponentExport = (source: string): string => {
  if (source.includes('export const Component')) {
    return source.replaceAll(/\bexport\s+const\s+Component\b/g, 'const Component')
  }

  throw new Error('TSX preview requires `export const Component = () => ...`')
}

const createTsxBootstrapScript = (transpiledSource: string): string => {
  return `(() => {
${transpiledSource}
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('TSX preview root element not found')
}
const output = Component()
if (output && typeof Node !== 'undefined' && output instanceof Node) {
  rootElement.replaceChildren(output)
  return
}
if (typeof ReactDOM === 'undefined') {
  throw new Error('ReactDOM failed to load for TSX preview')
}
if (typeof ReactDOM.createRoot === 'function') {
  const root = ReactDOM.createRoot(rootElement)
  root.render(output)
  return
}
if (typeof ReactDOM.render === 'function') {
  ReactDOM.render(output, rootElement)
  return
}
throw new Error('No supported ReactDOM render API found')
})()`
}

const fetchText = async (url: string): Promise<string> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }
  return response.text()
}

const getCachedText = async (url: string): Promise<string> => {
  if (typeof caches === 'undefined') {
    return fetchText(url)
  }

  const cache = await caches.open(PREVIEW_CDN_CACHE_NAME)
  const cached = await cache.match(url)
  if (cached) {
    return cached.text()
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }
  await cache.put(url, response.clone())
  return response.text()
}

const getBabel = async (): Promise<BabelStandalone> => {
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

const transpileTsx = async (source: string): Promise<string> => {
  const normalizedSource = ensureComponentExport(source)
  const babel = await getBabel()
  const result = babel.transform(normalizedSource, {
    presets: [
      ['typescript', { allExtensions: true, isTSX: true }],
      ['react', { runtime: 'classic' }],
    ],
    sourceType: 'script',
  })
  if (!result.code) {
    throw new Error('Failed to transpile TSX preview source')
  }
  return result.code
}

const getTsxScripts = async (source: string): Promise<readonly string[]> => {
  const [reactSource, reactDomSource, transpiledSource] = await Promise.all([
    getCachedText(REACT_CDN_URL),
    getCachedText(REACT_DOM_CDN_URL),
    transpileTsx(source),
  ])
  const bootstrapSource = createTsxBootstrapScript(transpiledSource)
  return [reactSource, reactDomSource, bootstrapSource]
}

export const loadTsx = async (state: PreviewState, content: string): Promise<TsxLoadResult> => {
  if (!state.loadJavaScript) {
    return {
      content,
      css: [],
      errorMessage: 'JavaScript execution is disabled, TSX preview is unavailable',
      parsedDom: [],
      parsedNodesChildNodeCount: 0,
      scripts: [],
      styleSheets: [],
    }
  }

  try {
    const scripts = await getTsxScripts(content)
    const scriptResult = await LoadScripts.loadScripts(state, TSX_PREVIEW_HTML, [], scripts)
    return {
      content,
      css: scriptResult.css,
      errorMessage: '',
      parsedDom: scriptResult.parsedDom,
      parsedNodesChildNodeCount: scriptResult.parsedNodesChildNodeCount,
      scripts,
      styleSheets: [],
    }
  } catch (error) {
    return {
      content,
      css: [],
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      parsedDom: [],
      parsedNodesChildNodeCount: 0,
      scripts: [],
      styleSheets: [],
    }
  }
}
