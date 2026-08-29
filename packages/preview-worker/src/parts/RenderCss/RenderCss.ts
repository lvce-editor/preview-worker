import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as ReplaceCssBodySelector from '../ReplaceCssBodySelector/ReplaceCssBodySelector.ts'
import * as ReplaceCssViewportUnits from '../ReplaceCssViewportUnits/ReplaceCssViewportUnits.ts'

const previewContainerCss = '.Preview { container-type: size; }'

export const renderCss = (oldState: PreviewState, newState: PreviewState): any => {
  const { css, uid } = newState

  // Combine all CSS strings into a single string
  let cssString = css.join('\n')

  // Replace html/body selectors with their virtual preview wrappers since document content is rendered in nested div elements
  cssString = ReplaceCssBodySelector.replaceCssBodySelector(cssString)

  const containerRelativeCss = ReplaceCssViewportUnits.replaceCssViewportUnits(cssString)
  if (containerRelativeCss !== cssString) {
    cssString = `${previewContainerCss}\n${containerRelativeCss}`
  }

  // Return command in format that can be handled by the viewlet
  // The 'Viewlet.setCss' is a method that should be called on the viewlet
  return ['Viewlet.setCss', uid, cssString]
}
