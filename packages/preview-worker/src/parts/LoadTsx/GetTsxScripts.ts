import { createTsxBootstrapScript } from './CreateTsxBootstrapScript.ts'
import { getCachedText } from './GetCachedText.ts'
import { transpileTsx } from './TranspileTsx.ts'

const REACT_CDN_URL = 'https://unpkg.com/react@19/umd/react.development.js'
const REACT_DOM_CDN_URL = 'https://unpkg.com/react-dom@19/umd/react-dom.development.js'

export const getTsxScripts = async (source: string): Promise<readonly string[]> => {
  const [reactSource, reactDomSource, transpiledSource] = await Promise.all([
    getCachedText(REACT_CDN_URL),
    getCachedText(REACT_DOM_CDN_URL),
    transpileTsx(source),
  ])
  const bootstrapSource = createTsxBootstrapScript(transpiledSource)
  return [reactSource, reactDomSource, bootstrapSource]
}
