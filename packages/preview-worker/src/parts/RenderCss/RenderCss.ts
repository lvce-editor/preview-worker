import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as ReplaceCssBodySelector from '../ReplaceCssBodySelector/ReplaceCssBodySelector.ts'

export const renderCss = (oldState: PreviewState, newState: PreviewState): any => {
  const { css, dynamicCanvasCss, uid } = newState

  // Combine all CSS strings (both regular and dynamic canvas CSS) into a single string
  const allCss = [...css, ...dynamicCanvasCss]
  let cssString = allCss.join('\n')

  // Replace body selector with .Preview since we render the preview in a div element, not a body
  cssString = ReplaceCssBodySelector.replaceCssBodySelector(cssString)

  // Return command in format that can be handled by the viewlet
  // The 'Viewlet.setCss' is a method that should be called on the viewlet
  return ['Viewlet.setCss', uid, cssString]
}
