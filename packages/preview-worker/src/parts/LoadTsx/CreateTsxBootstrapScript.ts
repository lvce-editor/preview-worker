export const createTsxBootstrapScript = (transpiledSource: string): string => {
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
