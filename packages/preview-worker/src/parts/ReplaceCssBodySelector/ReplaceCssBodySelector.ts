const BODY_SELECTOR_REGEX = /\bbody\b/g
const UNIVERSAL_SELECTOR_REGEX = /^\s*\*/gm

/**
 * Replaces the 'body' CSS selector with '.Preview' since the preview is rendered
 * inside a div element with the class 'Preview', not in a body element.
 * Also replaces the universal selector '*' with '.Preview *' to scope it to the preview div.
 *
 * @param css The CSS string to process
 * @returns The CSS string with 'body' selectors replaced with '.Preview' and '*' with '.Preview *'
 */
export const replaceCssBodySelector = (css: string): string => {
  // Use word boundaries to ensure only the word 'body' is replaced,
  // not parts of other words like 'tbody'
  let result = css.replaceAll(BODY_SELECTOR_REGEX, '.Preview')
  // Replace universal selectors at the start of a selector with '.Preview *'
  result = result.replaceAll(UNIVERSAL_SELECTOR_REGEX, '.Preview *')
  return result
}
