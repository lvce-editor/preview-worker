const BODY_SELECTOR_REGEX = /\bbody\b/g
const BUTTON_SELECTOR_REGEX = /\bbutton\b/g
const UNIVERSAL_SELECTOR_REGEX = /(?:^|([,}]))\s*(\*(?=\s*[{:]|[\w.#:[-]))/gm

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

  // Replace 'button' selector with '.Preview button' to scope it to the preview div
  result = result.replaceAll(BUTTON_SELECTOR_REGEX, '.Preview button')

  // Replace universal selectors at the start of a rule (beginning of string or after })
  // with '.Preview *' to scope them to the preview div
  result = result.replaceAll(UNIVERSAL_SELECTOR_REGEX, (match, prefix, star) => {
    return (prefix ? prefix + ' ' : '') + '.Preview *'
  })

  return result
}
