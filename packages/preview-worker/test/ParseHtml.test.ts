import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import { parseHtml } from '../src/parts/ParseHtml/ParseHtml.ts'

// Basic HTML parsing tests
test('parseHtml should parse empty string', () => {
  const expectedArray: typeof result = []
  const result = parseHtml('', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse simple div tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Div }]
  const result = parseHtml('<div></div>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse simple span tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Span }]
  const result = parseHtml('<span></span>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse paragraph tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.P }]
  const result = parseHtml('<p></p>', [])
  expect(result).toEqual(expectedArray)
})

// Text content tests
test('parseHtml should parse text content', () => {
  const expectedArray = [text('Hello World')]
  const result = parseHtml('Hello World', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse text inside div', () => {
  const expectedArray = [{ childCount: 1, type: VirtualDomElements.Div }, text('Hello')]
  const result = parseHtml('<div>Hello</div>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse multiple text nodes', () => {
  const result = parseHtml('<div>Hello</div><div>World</div>', [])
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Div },
    text('Hello'),
    { childCount: 1, type: VirtualDomElements.Div },
    text('World'),
  ]
  expect(result).toEqual(expectedArray)
})

// Nested tags tests
test('parseHtml should parse nested tags', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 0, type: VirtualDomElements.Span },
  ]
  const result = parseHtml('<div><span></span></div>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse deeply nested tags', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 1, type: VirtualDomElements.P },
    { childCount: 0, type: VirtualDomElements.Span },
  ]
  const result = parseHtml('<div><p><span></span></p></div>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle multiple levels of nesting', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 0, type: VirtualDomElements.Div },
  ]
  const result = parseHtml('<div><div><div></div></div></div>', [])
  expect(result).toEqual(expectedArray)
})

// Attributes tests
test('parseHtml should allow specified attributes', () => {
  const expectedArray = [{ childCount: 0, 'data-id': '123', type: VirtualDomElements.Div }]
  const result = parseHtml('<div data-id="123"></div>', ['data-id'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should not allow unspecified attributes', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Div }]
  const result = parseHtml('<div onclick="alert()"></div>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should allow multiple attributes when specified', () => {
  const expectedArray = [{ childCount: 0, 'data-id': '123', title: 'test', type: VirtualDomElements.Div }]
  const result = parseHtml('<div data-id="123" title="test"></div>', ['data-id', 'title'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should allow only specified attributes from multiple', () => {
  const expectedArray = [{ childCount: 0, 'data-id': '123', type: VirtualDomElements.Div }]
  const result = parseHtml('<div data-id="123" onclick="alert()"></div>', ['data-id'])
  expect(result).toEqual(expectedArray)
})

// Class to className conversion tests
test('parseHtml should convert class attribute to className', () => {
  const expectedArray = [{ childCount: 0, className: 'container', type: VirtualDomElements.Div }]
  const result = parseHtml('<div class="container"></div>', ['class'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should convert class with multiple values', () => {
  const expectedArray = [{ childCount: 0, className: 'container primary active', type: VirtualDomElements.Div }]
  const result = parseHtml('<div class="container primary active"></div>', ['class'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should convert class on nested elements', () => {
  const expectedArray = [
    { childCount: 1, className: 'outer', type: VirtualDomElements.Div },
    { childCount: 0, className: 'inner', type: VirtualDomElements.Span },
  ]
  const result = parseHtml('<div class="outer"><span class="inner"></span></div>', ['class'])
  expect(result).toEqual(expectedArray)
})

// Self-closing tags tests
test('parseHtml should parse self-closing br tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Br }]
  const result = parseHtml('<br>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse self-closing img tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Img }]
  const result = parseHtml('<img>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse self-closing hr tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Hr }]
  const result = parseHtml('<hr>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse self-closing input tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Input }]
  const result = parseHtml('<input>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle attributes on self-closing tags', () => {
  const expectedArray = [{ childCount: 0, src: 'test.jpg', type: VirtualDomElements.Img }]
  const result = parseHtml('<img src="test.jpg">', ['src'])
  expect(result).toEqual(expectedArray)
})

// Multiple elements tests
test('parseHtml should parse multiple sibling elements', () => {
  const expectedArray = [
    { childCount: 0, type: VirtualDomElements.Div },
    { childCount: 0, type: VirtualDomElements.Span },
    { childCount: 0, type: VirtualDomElements.P },
  ]
  const result = parseHtml('<div></div><span></span><p></p>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse multiple divs with content', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Div },
    text('First'),
    { childCount: 1, type: VirtualDomElements.Div },
    text('Second'),
  ]
  const result = parseHtml('<div>First</div><div>Second</div>', [])
  expect(result).toEqual(expectedArray)
})

// Complex structures tests
test('parseHtml should parse list structure', () => {
  const expectedArray = [
    { childCount: 2, type: VirtualDomElements.Ul },
    { childCount: 1, type: VirtualDomElements.Li },
    text('Item 1'),
    { childCount: 1, type: VirtualDomElements.Li },
    text('Item 2'),
  ]
  const result = parseHtml('<ul><li>Item 1</li><li>Item 2</li></ul>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse table structure', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Table },
    { childCount: 1, type: VirtualDomElements.Tr },
    { childCount: 1, type: VirtualDomElements.Td },
    text('Cell'),
  ]
  const result = parseHtml('<table><tr><td>Cell</td></tr></table>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse heading with content', () => {
  const expectedArray = [{ childCount: 1, type: VirtualDomElements.H1 }, text('Title')]
  const result = parseHtml('<h1>Title</h1>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse multiple heading levels', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.H1 },
    text('H1'),
    { childCount: 1, type: VirtualDomElements.H2 },
    text('H2'),
    { childCount: 1, type: VirtualDomElements.H3 },
    text('H3'),
  ]
  const result = parseHtml('<h1>H1</h1><h2>H2</h2><h3>H3</h3>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse h1 with hello world content', () => {
  const expectedArray = [{ childCount: 1, type: VirtualDomElements.H1 }, text('hello world')]
  const result = parseHtml('<h1>hello world</h1>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse h2 with live updating html content', () => {
  const expectedArray = [{ childCount: 1, type: VirtualDomElements.H2 }, text('this is live updating html')]
  const result = parseHtml('<h2>this is live updating html</h2>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse combined h1 and h2 elements', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.H1 },
    text('hello world'),
    text('\n'),
    { childCount: 1, type: VirtualDomElements.H2 },
    text('this is live updating html'),
  ]
  const result = parseHtml('<h1>hello world</h1>\n<h2>this is live updating html</h2>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse form structure', () => {
  const expectedArray = [
    { childCount: 2, type: VirtualDomElements.Div },
    { childCount: 0, type: VirtualDomElements.Input },
    { childCount: 1, type: VirtualDomElements.Button },
    text('Submit'),
  ]
  const result = parseHtml('<form><input><button>Submit</button></form>', [])
  expect(result).toEqual(expectedArray)
})

// Text with special characters tests
test('parseHtml should handle text with spaces', () => {
  const expectedArray = [{ childCount: 1, type: VirtualDomElements.Div }, text('Hello   World')]
  const result = parseHtml('<div>Hello   World</div>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle text with newlines', () => {
  const expectedArray = [{ childCount: 1, type: VirtualDomElements.Div }, text('Line1\nLine2')]
  const result = parseHtml('<div>Line1\nLine2</div>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle text with tabs', () => {
  const expectedArray = [{ childCount: 1, type: VirtualDomElements.Div }, text('Text\twith\ttabs')]
  const result = parseHtml('<div>Text\twith\ttabs</div>', [])
  expect(result).toEqual(expectedArray)
})

// Element-specific tests
test('parseHtml should parse anchor tag', () => {
  const expectedArray = [{ childCount: 1, href: 'https://example.com', type: VirtualDomElements.A }, text('Link')]
  const result = parseHtml('<a href="https://example.com">Link</a>', ['href'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse article tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Article }]
  const result = parseHtml('<article></article>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse aside tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Aside }]
  const result = parseHtml('<aside></aside>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse button tag', () => {
  const expectedArray = [{ childCount: 1, type: VirtualDomElements.Button }, text('Click')]
  const result = parseHtml('<button>Click</button>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse header tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Header }]
  const result = parseHtml('<header></header>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse footer tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Footer }]
  const result = parseHtml('<footer></footer>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse main tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Div }]
  const result = parseHtml('<main></main>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse nav tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Nav }]
  const result = parseHtml('<nav></nav>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse section tag', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Section }]
  const result = parseHtml('<section></section>', [])
  expect(result).toEqual(expectedArray)
})

// Text formatting tags
test('parseHtml should parse strong tag', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 0, text: 'Bold', type: VirtualDomElements.Text },
  ]
  const result = parseHtml('<strong>Bold</strong>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse em tag', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 0, text: 'Italic', type: VirtualDomElements.Text },
  ]
  const result = parseHtml('<em>Italic</em>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse code tag', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Code },
    { childCount: 0, text: 'const x = 1;', type: VirtualDomElements.Text },
  ]
  const result = parseHtml('<code>const x = 1;</code>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse pre tag', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Pre },
    { childCount: 0, text: 'Preformatted', type: VirtualDomElements.Text },
  ]
  const result = parseHtml('<pre>Preformatted</pre>', [])
  expect(result).toEqual(expectedArray)
})

// Mixed content tests
test('parseHtml should parse mixed text and elements', () => {
  const expectedArray = [
    { childCount: 0, text: 'Text', type: VirtualDomElements.Text },
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 0, text: 'Inside', type: VirtualDomElements.Text },
    { childCount: 0, text: 'More text', type: VirtualDomElements.Text },
  ]
  const result = parseHtml('Text<div>Inside</div>More text', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse inline and block elements', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 1, type: VirtualDomElements.Span },
    { childCount: 0, text: 'text', type: VirtualDomElements.Text },
  ]
  const result = parseHtml('<div><span>text</span></div>', [])
  expect(result).toEqual(expectedArray)
})

// Edge cases
test('parseHtml should handle tag case insensitivity', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Div }]
  const result = parseHtml('<DIV></DIV>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle whitespace between tags', () => {
  const expectedArray = [
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 0, text: '  ', type: VirtualDomElements.Text },
  ]
  const result = parseHtml('<div>  </div>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle consecutive self-closing tags', () => {
  const expectedArray = [
    { childCount: 0, type: VirtualDomElements.Br },
    { childCount: 0, type: VirtualDomElements.Hr },
    { childCount: 0, type: VirtualDomElements.Br },
  ]
  const result = parseHtml('<br><hr><br>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should ignore attributes not in allowedAttributes', () => {
  const expectedArray = [{ childCount: 0, 'data-valid': 'yes', type: VirtualDomElements.Div }]
  const allowedAttributes = ['data-valid']
  const result = parseHtml('<div data-valid="yes" data-invalid="no"></div>', allowedAttributes)
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle empty allowedAttributes array', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Div }]
  const result = parseHtml('<div id="test" class="cls"></div>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should preserve attribute order when multiple allowed', () => {
  const expectedArray = [{ childCount: 0, 'data-first': '1', 'data-second': '2', 'data-third': '3', type: VirtualDomElements.Div }]
  const result = parseHtml('<div data-first="1" data-second="2" data-third="3"></div>', ['data-first', 'data-second', 'data-third'])
  expect(result).toEqual(expectedArray)
})

// Complex real-world examples
test('parseHtml should parse full card structure', () => {
  const html = '<div class="card"><div class="card-header"><h2>Title</h2></div><div class="card-body"><p>Content</p></div><div class="card-footer"><button>Action</button></div></div>'
  const expectedArray = [
    { childCount: 3, className: 'card', type: VirtualDomElements.Div },
    { childCount: 1, className: 'card-header', type: VirtualDomElements.Div },
    { childCount: 1, type: VirtualDomElements.H2 },
    { childCount: 0, text: 'Title', type: VirtualDomElements.Text },
    { childCount: 1, className: 'card-body', type: VirtualDomElements.Div },
    { childCount: 1, type: VirtualDomElements.P },
    { childCount: 0, text: 'Content', type: VirtualDomElements.Text },
    { childCount: 1, className: 'card-footer', type: VirtualDomElements.Div },
    { childCount: 1, type: VirtualDomElements.Button },
    { childCount: 0, text: 'Action', type: VirtualDomElements.Text },
  ]
  const result = parseHtml(html, ['class'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse navigation menu', () => {
  const html = '<nav class="navbar"><ul class="nav-list"><li><a href="/">Home</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul></nav>'
  const expectedArray = [
    { childCount: 1, className: 'navbar', type: VirtualDomElements.Nav },
    { childCount: 3, className: 'nav-list', type: VirtualDomElements.Ul },
    { childCount: 1, type: VirtualDomElements.Li },
    { childCount: 1, href: '/', type: VirtualDomElements.A },
    { childCount: 0, text: 'Home', type: VirtualDomElements.Text },
    { childCount: 1, type: VirtualDomElements.Li },
    { childCount: 1, href: '/about', type: VirtualDomElements.A },
    { childCount: 0, text: 'About', type: VirtualDomElements.Text },
    { childCount: 1, type: VirtualDomElements.Li },
    { childCount: 1, href: '/contact', type: VirtualDomElements.A },
    { childCount: 0, text: 'Contact', type: VirtualDomElements.Text },
  ]
  const result = parseHtml(html, ['class', 'href'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse article with metadata', () => {
  const html = '<article class="post" data-id="123"><header><h1>Article Title</h1><time>2024-01-15</time></header><main><p>Article content goes here.</p></main></article>'
  const expectedArray = [
    { childCount: 2, className: 'post', 'data-id': '123', type: VirtualDomElements.Article },
    { childCount: 2, type: VirtualDomElements.Header },
    { childCount: 1, type: VirtualDomElements.H1 },
    { childCount: 0, text: 'Article Title', type: VirtualDomElements.Text },
    { childCount: 1, type: VirtualDomElements.Time },
    { childCount: 0, text: '2024-01-15', type: VirtualDomElements.Text },
    { childCount: 1, type: VirtualDomElements.Main },
    { childCount: 1, type: VirtualDomElements.P },
    { childCount: 0, text: 'Article content goes here.', type: VirtualDomElements.Text },
  ]
  const result = parseHtml(html, ['class', 'data-id'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should maintain childCount property', () => {
  const expectedArray = [
    { childCount: 2, type: VirtualDomElements.Div },
    { childCount: 0, type: VirtualDomElements.Span },
    { childCount: 0, type: VirtualDomElements.Span },
  ]
  const result = parseHtml('<div><span></span><span></span></div>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle void elements correctly', () => {
  const testCases: Array<[string, number]> = [
    ['<area>', VirtualDomElements.Div],
    ['<base>', VirtualDomElements.Div],
    ['<br>', VirtualDomElements.Br],
    ['<col>', VirtualDomElements.Div],
    ['<embed>', VirtualDomElements.Div],
    ['<hr>', VirtualDomElements.Hr],
    ['<img>', VirtualDomElements.Img],
    ['<input>', VirtualDomElements.Input],
    ['<link>', VirtualDomElements.Div],
    ['<meta>', VirtualDomElements.Div],
    ['<param>', VirtualDomElements.Div],
    ['<source>', VirtualDomElements.Div],
    ['<track>', VirtualDomElements.Div],
    ['<wbr>', VirtualDomElements.Div],
  ]
  for (const [elem, expectedType] of testCases) {
    const result = parseHtml(elem, [])
    const expectedArray = [{ childCount: 0, type: expectedType }]
    expect(result).toEqual(expectedArray)
  }
})

test('parseHtml should handle semantic HTML5 elements', () => {
  const html = '<article><header><h1>Topic</h1></header><section>Content</section><aside>Related</aside><footer>Meta</footer></article>'
  const expectedArray = [
    { childCount: 4, type: VirtualDomElements.Article },
    { childCount: 1, type: VirtualDomElements.Header },
    { childCount: 1, type: VirtualDomElements.H1 },
    { childCount: 0, text: 'Topic', type: VirtualDomElements.Text },
    { childCount: 1, type: VirtualDomElements.Section },
    { childCount: 0, text: 'Content', type: VirtualDomElements.Text },
    { childCount: 1, type: VirtualDomElements.Aside },
    { childCount: 0, text: 'Related', type: VirtualDomElements.Text },
    { childCount: 1, type: VirtualDomElements.Footer },
    { childCount: 0, text: 'Meta', type: VirtualDomElements.Text },
  ]
  const result = parseHtml(html, [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle data attributes', () => {
  const expectedArray = [{ childCount: 0, 'data-role': 'admin', 'data-user-id': '42', type: VirtualDomElements.Div }]
  const result = parseHtml('<div data-user-id="42" data-role="admin"></div>', ['data-user-id', 'data-role'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle aria attributes', () => {
  const expectedArray = [{ 'aria-hidden': 'true', 'aria-label': 'Close', childCount: 0, type: VirtualDomElements.Div }]
  const result = parseHtml('<div aria-label="Close" aria-hidden="true"></div>', ['aria-label', 'aria-hidden'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should parse style attributes when allowed', () => {
  const expectedArray = [{ childCount: 0, style: 'color: red;', type: VirtualDomElements.Div }]
  const result = parseHtml('<div style="color: red;"></div>', ['style'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should not parse style attributes when not allowed', () => {
  const expectedArray = [{ childCount: 0, type: VirtualDomElements.Div }]
  const result = parseHtml('<div style="color: red;"></div>', [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle very long attribute values', () => {
  const longValue = 'x'.repeat(1000)
  const expectedArray = [{ childCount: 0, 'data-long': longValue, type: VirtualDomElements.Div }]
  const result = parseHtml(`<div data-long="${longValue}"></div>`, ['data-long'])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle many siblings', () => {
  let html = ''
  const expectedArray = []
  for (let i = 0; i < 100; i++) {
    html += `<div>Item ${i}</div>`
    expectedArray.push({ childCount: 1, type: VirtualDomElements.Div })
    expectedArray.push({ childCount: 0, text: `Item ${i}`, type: VirtualDomElements.Text })
  }
  const result = parseHtml(html, [])
  expect(result).toEqual(expectedArray)
})

test('parseHtml should handle deeply nested structure', () => {
  let html = '<div>'
  const expectedArrayItems: VirtualDomNode[] = [{ childCount: 1, type: VirtualDomElements.Div }]
  for (let i = 0; i < 50; i++) {
    html += '<div>'
    expectedArrayItems.push({ childCount: 1, type: VirtualDomElements.Div })
  }
  html += 'Deep'
  expectedArrayItems.push({ childCount: 0, text: 'Deep', type: VirtualDomElements.Text })
  for (let i = 0; i < 50; i++) {
    html += '</div>'
  }
  html += '</div>'
  const result = parseHtml(html, [])
  expect(result).toEqual(expectedArrayItems)
})
test('parseHtml should parse button with disabled attribute', () => {
  const expectedArray = [
    { childCount: 1, disabled: 'disabled', type: VirtualDomElements.Button },
    { childCount: 0, text: 'test button', type: VirtualDomElements.Text },
  ]
  const result = parseHtml('<button disabled>test button</button>', ['disabled'])
  expect(result).toEqual(expectedArray)
})
