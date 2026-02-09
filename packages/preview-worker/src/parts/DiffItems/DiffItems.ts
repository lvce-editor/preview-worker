import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const isEqual = (oldState: PreviewState, newState: PreviewState): boolean => {
  return (
    oldState.warningCount === newState.warningCount &&
    oldState.initial === newState.initial &&
    oldState.content === newState.content &&
    oldState.parsedDom === newState.parsedDom &&
    oldState.parsedNodesChildNodeCount === newState.parsedNodesChildNodeCount &&
    oldState.css === newState.css &&
    oldState.dynamicCanvasCss === newState.dynamicCanvasCss &&
    oldState.scripts === newState.scripts
  )
}
