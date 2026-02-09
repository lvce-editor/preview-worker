import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const iEqual = (oldState: PreviewState, newState: PreviewState): boolean => {
  if (oldState.css.length !== newState.css.length) {
    return false
  }

  for (let i = 0; i < oldState.css.length; i++) {
    if (oldState.css[i] !== newState.css[i]) {
      return false
    }
  }

  if (oldState.dynamicCanvasCss.length !== newState.dynamicCanvasCss.length) {
    return false
  }

  for (let i = 0; i < oldState.dynamicCanvasCss.length; i++) {
    if (oldState.dynamicCanvasCss[i] !== newState.dynamicCanvasCss[i]) {
      return false
    }
  }

  return true
}
