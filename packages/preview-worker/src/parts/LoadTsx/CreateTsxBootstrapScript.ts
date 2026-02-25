export const createTsxBootstrapScript = (transpiledSource: string): string => {
  return `;(async () => {
const reactModule = await import('https://esm.sh/react@19/?dev')
const reactDomClientModule = await import('https://esm.sh/react-dom@19/client?dev')
const React = reactModule.default ?? reactModule
const ReactDOMClient = reactDomClientModule.default ?? reactDomClientModule
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
if (!ReactDOMClient || typeof ReactDOMClient.createRoot !== 'function') {
  throw new Error('ReactDOM client failed to load for TSX preview')
}
const root = ReactDOMClient.createRoot(rootElement)
root.render(output)
})().catch((error) => {
  setTimeout(() => {
    throw error
  }, 0)
})`
}
