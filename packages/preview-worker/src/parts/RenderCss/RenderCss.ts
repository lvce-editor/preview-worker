import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const renderCss = (oldState: PreviewState, newState: PreviewState): any => {
  const { uid, css } = newState

  // Combine all CSS strings into a single string
  const cssString = css.join('\n')

  // Return command in format that can be handled by the viewlet
  // The 'Viewlet.setCss' is a method that should be called on the viewlet
  return ['Viewlet.setCss', uid, cssString]
}
