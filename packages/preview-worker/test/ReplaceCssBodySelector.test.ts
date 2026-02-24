import { expect, test } from '@jest/globals'
import * as ReplaceCssBodySelector from '../src/parts/ReplaceCssBodySelector/ReplaceCssBodySelector.ts'

const normalizeWhitespace = (value: string): string => value.replaceAll(/\s+/g, ' ').trim()

test('should replace simple body selector', () => {
  const css = 'body { color: red; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview {  color: red;  }')
})

test('should replace body in combined selectors', () => {
  const css = 'body, div { margin: 0; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview, .Preview div {  margin: 0;  }')
})

test('should replace multiple body selectors', () => {
  const css = 'body { color: red; } body p { margin: 10px; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview {  color: red;  } .Preview p {  margin: 10px;  }')
})

test('should not replace tbody', () => {
  const css = 'tbody { border: 1px solid; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview tbody {  border: 1px solid;  }')
})

test('should not replace body as part of another word', () => {
  const css = 'somebody { color: blue; } anybody-class { display: none; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview somebody {  color: blue;  } .Preview anybody-class {  display: none;  }')
})

test('should handle body with pseudo-classes', () => {
  const css = 'body:hover { background: yellow; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview:hover {  background: yellow;  }')
})

test('should handle body with pseudo-elements', () => {
  const css = 'body::before { content: ""; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview::before {  content: "";  }')
})

test('should handle body with descendant selectors', () => {
  const css = 'body > * { box-sizing: border-box; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview > * {  box-sizing: border-box;  }')
})

test('should handle empty CSS string', () => {
  const css = ''
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('')
})

test('should handle CSS without body selector', () => {
  const css = 'div { color: green; } p { margin: 5px; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview div {  color: green;  } .Preview p {  margin: 5px;  }')
})

test('should handle body with newlines', () => {
  const css = `body {
  color: red;
  background: white;
}`
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe(`.Preview {
  color: red;
  background: white;
 }`)
})

test('should handle multiple body selectors in different contexts', () => {
  const css = 'body { font-size: 16px; } .container body { display: flex; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview {  font-size: 16px;  } .container .Preview {  display: flex;  }')
})

test('should scope universal selector', () => {
  const css = '* { box-sizing: border-box; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview * {  box-sizing: border-box;  }')
})

test('should scope multiple universal selectors', () => {
  const css = '* { margin: 0; } * { padding: 0; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview * {  margin: 0;  } .Preview * {  padding: 0;  }')
})

test('should scope universal selector with pseudo-classes', () => {
  const css = '*:hover { outline: 1px solid red; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview *:hover {  outline: 1px solid red;  }')
})

test('should handle both body and universal selectors', () => {
  const css = 'body { color: black; } * { box-sizing: border-box; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toBe('.Preview {  color: black;  } .Preview * {  box-sizing: border-box;  }')
})

test('should scope rules after malformed css and prevent root breakout', () => {
  const css = '#target { color: rgb(0, 0, 255); } } :root { background-color: rgb(255, 0, 0) !important; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toContain('.Preview #target {  color: rgb(0, 0, 255);  }')
  expect(result).toContain('.Preview :root {  background-color: rgb(255, 0, 0) !important;  }')
  expect(result).not.toContain(' } :root {')
})

test('should replace html selector with preview selector', () => {
  const css = 'html { color: red; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('.Preview { color: red; }')
})

test('should replace html and body in combined selectors', () => {
  const css = 'html, body, main { margin: 0; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('.Preview, .Preview, .Preview main { margin: 0; }')
})

test('should keep already scoped selector unchanged and scope remaining selectors', () => {
  const css = '.Preview button, button { border: 0; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('.Preview button, .Preview button { border: 0; }')
})

test('should handle selector list with not pseudo class commas', () => {
  const css = 'div:not(.a, .b), span { color: blue; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('.Preview div:not(.a, .b), .Preview span { color: blue; }')
})

test('should handle selector list with is pseudo class commas', () => {
  const css = ':is(body, html, main) { display: block; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('.Preview :is(.Preview, .Preview, main) { display: block; }')
})

test('should handle attribute selector containing comma', () => {
  const css = '[data-value="a,b"], body { color: red; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('.Preview [data-value="a,b"], .Preview { color: red; }')
})

test('should keep comments inside declarations', () => {
  const css = 'body { color: red; /* keep-me */ background: white; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(result).toContain('/* keep-me */')
  expect(normalizeWhitespace(result)).toContain('.Preview { color: red; /* keep-me */ background: white; }')
})

test('should process rules separated by comments', () => {
  const css = 'body { color: red; } /* between */ div { color: blue; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toContain('.Preview { color: red; }')
  expect(normalizeWhitespace(result)).toContain('.Preview div { color: blue; }')
})

test('should scope selectors in media query', () => {
  const css = '@media (max-width: 500px) { body { color: red; } div { margin: 0; } }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('@media (max-width: 500px) { .Preview { color: red; } .Preview div { margin: 0; } }')
})

test('should scope selectors in supports query', () => {
  const css = '@supports (display: grid) { body { display: grid; } }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('@supports (display: grid) { .Preview { display: grid; } }')
})

test('should scope selectors in container query', () => {
  const css = '@container sidebar (min-width: 300px) { body { font-size: 12px; } }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('@container sidebar (min-width: 300px) { .Preview { font-size: 12px; } }')
})

test('should scope selectors in layer blocks', () => {
  const css = '@layer theme { html { color: black; } }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('@layer theme { .Preview { color: black; } }')
})

test('should scope selectors in scope blocks', () => {
  const css = '@scope (.card) { body { padding: 8px; } }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('@scope (.card) { .Preview { padding: 8px; } }')
})

test('should scope selectors in document blocks', () => {
  const css = '@document url-prefix("https://example.com") { body { color: green; } }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('@document url-prefix("https://example.com") { .Preview { color: green; } }')
})

test('should recurse through nested media and supports blocks', () => {
  const css = '@media (min-width: 500px) { @supports (display: flex) { body { display: flex; } } }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('@media (min-width: 500px) { @supports (display: flex) { .Preview { display: flex; } } }')
})

test('should preserve keyframes without scoping inside keyframes', () => {
  const css = '@keyframes fade { from { opacity: 0; } to { opacity: 1; } } body { animation: fade 1s; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toContain('@keyframes fade { from { opacity: 0; } to { opacity: 1; } }')
  expect(normalizeWhitespace(result)).toContain('.Preview { animation: fade 1s; }')
})

test('should preserve font-face blocks', () => {
  const css = '@font-face { font-family: test; src: url(test.woff2); } body { font-family: test; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toContain('@font-face { font-family: test; src: url(test.woff2); }')
  expect(normalizeWhitespace(result)).toContain('.Preview { font-family: test; }')
})

test('should preserve page blocks', () => {
  const css = '@page { margin: 1cm; } body { color: black; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toContain('@page { margin: 1cm; }')
  expect(normalizeWhitespace(result)).toContain('.Preview { color: black; }')
})

test('should preserve import statements', () => {
  const css = '@import url("./foo.css"); body { color: red; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toContain('@import url("./foo.css");')
  expect(normalizeWhitespace(result)).toContain('.Preview { color: red; }')
})

test('should support css nesting syntax under scoped parent', () => {
  const css = '.card { & .title { color: red; } }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('.Preview .card { & .title { color: red; } }')
})

test('should support css nesting syntax with body as parent selector', () => {
  const css = 'body { & .title { color: red; } }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('.Preview { & .title { color: red; } }')
})

test('should scope deeply nested rule content in media query', () => {
  const css = '@media (min-width: 700px) { .a { & .b { color: red; } } }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('@media (min-width: 700px) { .Preview .a { & .b { color: red; } } }')
})

test('should handle class names that include html or body substrings', () => {
  const css = '.html-body-mix { color: red; } .somebody { color: blue; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('.Preview .html-body-mix { color: red; } .Preview .somebody { color: blue; }')
})

test('should ignore unmatched closing braces between valid rules', () => {
  const css = 'div { color: red; } } } span { color: blue; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('.Preview div { color: red; } .Preview span { color: blue; }')
})

test('should keep valid rules before malformed unclosed block', () => {
  const css = 'div { color: red; } p { color: blue;'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toBe('.Preview div { color: red; }')
})

test('should scope multiple top-level at-rule and normal rule combinations', () => {
  const css = '@import url("a.css"); @media (min-width: 1px) { body { margin: 0; } } main { padding: 4px; }'
  const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
  expect(normalizeWhitespace(result)).toContain('@import url("a.css");')
  expect(normalizeWhitespace(result)).toContain('@media (min-width: 1px) { .Preview { margin: 0; } }')
  expect(normalizeWhitespace(result)).toContain('.Preview main { padding: 4px; }')
})
