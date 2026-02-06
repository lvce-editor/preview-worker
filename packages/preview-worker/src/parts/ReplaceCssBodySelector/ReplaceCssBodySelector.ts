const BODY_SELECTOR_REGEX = /\bbody\b/g

/**
 * Replaces the 'body' CSS selector with '.Preview' since the preview is rendered
 * inside a div element with the class 'Preview', not in a body element.
 *
 * @param css The CSS string to process
 * @returns The CSS string with 'body' selectors replaced with '.Preview'
 */
export const replaceCssBodySelector = (css: string): string => {
  // Use word boundaries to ensure only the word 'body' is replaced,
  // not parts of other words like 'tbody'
  return css.replace(BODY_SELECTOR_REGEX, '.Preview')
}
