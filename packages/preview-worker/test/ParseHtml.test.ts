import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { parseHtml } from '../src/parts/ParseHtml/ParseHtml.ts'

// Basic HTML parsing tests
test('parseHtml should parse empty string', () => {
  const result = parseHtml('', [])
  expect(result).toEqual([])
})

test('parseHtml should parse simple div tag', () => {
  const result = parseHtml('<div></div>', [])
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe(VirtualDomElements.Div)
})

test('parseHtml should parse simple span tag', () => {
  const result = parseHtml('<span></span>', [])
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe(VirtualDomElements.Span)
})

test('parseHtml should parse paragraph tag', () => {
  const result = parseHtml('<p></p>', [])
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe(VirtualDomElements.P)
})

// Text content tests
test('parseHtml should parse text content', () => {
  const result = parseHtml('Hello World', [])
  expect(result).toHaveLength(1)
  expect(result[0]).toHaveProperty('text')
})

test('parseHtml should parse text inside div', () => {
  const result = parseHtml('<div>Hello</div>', [])
  expect(result).toHaveLength(2) // div and text
  expect(result[0].type).toBe(VirtualDomElements.Div)
  expect(result[1]).toHaveProperty('text')
})

test('parseHtml should parse multiple text nodes', () => {
  const result = parseHtml('<div>Hello</div><div>World</div>', [])
  expect(result.length).toBeGreaterThan(0)
})

// Nested tags tests
test('parseHtml should parse nested tags', () => {
  const result = parseHtml('<div><span></span></div>', [])
  expect(result).toHaveLength(2) // div and span
  expect(result[0].type).toBe(VirtualDomElements.Div)
  expect(result[0].childCount).toBe(1)
})

test('parseHtml should parse deeply nested tags', () => {
  const result = parseHtml('<div><p><span></span></p></div>', [])
  expect(result).toHaveLength(3) // div, p, span
})

test('parseHtml should handle multiple levels of nesting', () => {
  const result = parseHtml('<div><div><div></div></div></div>', [])
  expect(result).toHaveLength(3) // three divs
})

// Attributes tests
test('parseHtml should allow specified attributes', () => {
  const result = parseHtml('<div data-id="123"></div>', ['data-id'])
  expect(result[0]['data-id']).toBe('123')
})

test('parseHtml should not allow unspecified attributes', () => {
  const result = parseHtml('<div onclick="alert()"></div>', [])
  expect(result[0]['onclick']).toBeUndefined()
})

test('parseHtml should allow multiple attributes when specified', () => {
  const result = parseHtml('<div data-id="123" title="test"></div>', ['data-id', 'title'])
  expect(result[0]['data-id']).toBe('123')
  expect(result[0]['title']).toBe('test')
})

test('parseHtml should allow only specified attributes from multiple', () => {
  const result = parseHtml('<div data-id="123" onclick="alert()"></div>', ['data-id'])
  expect(result[0]['data-id']).toBe('123')
  expect(result[0]['onclick']).toBeUndefined()
})

// Class to className conversion tests
test('parseHtml should convert class attribute to className', () => {
  const result = parseHtml('<div class="container"></div>', ['class'])
  expect(result[0]['className']).toBe('container')
  expect(result[0]['class']).toBeUndefined()
})

test('parseHtml should convert class with multiple values', () => {
  const result = parseHtml('<div class="container primary active"></div>', ['class'])
  expect(result[0]['className']).toBe('container primary active')
})

test('parseHtml should convert class on nested elements', () => {
  const result = parseHtml('<div class="outer"><span class="inner"></span></div>', ['class'])
  expect(result[0]['className']).toBe('outer')
  expect(result[1]['className']).toBe('inner')
})

// Self-closing tags tests
test('parseHtml should parse self-closing br tag', () => {
  const result = parseHtml('<br>', [])
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe(VirtualDomElements.Br)
})

test('parseHtml should parse self-closing img tag', () => {
  const result = parseHtml('<img>', [])
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe(VirtualDomElements.Img)
})

test('parseHtml should parse self-closing hr tag', () => {
  const result = parseHtml('<hr>', [])
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe(VirtualDomElements.Hr)
})

test('parseHtml should parse self-closing input tag', () => {
  const result = parseHtml('<input>', [])
  expect(result).toHaveLength(1)
  expect(result[0].type).toBe(VirtualDomElements.Input)
})

test('parseHtml should handle attributes on self-closing tags', () => {
  const result = parseHtml('<img src="test.jpg">', ['src'])
  expect(result[0]['src']).toBe('test.jpg')
})

// Multiple elements tests
test('parseHtml should parse multiple sibling elements', () => {
  const result = parseHtml('<div></div><span></span><p></p>', [])
  expect(result).toHaveLength(3)
})

test('parseHtml should parse multiple divs with content', () => {
  const result = parseHtml('<div>First</div><div>Second</div>', [])
  expect(result.length).toBeGreaterThan(0)
})

// Complex structures tests
test('parseHtml should parse list structure', () => {
  const result = parseHtml('<ul><li>Item 1</li><li>Item 2</li></ul>', [])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should parse table structure', () => {
  const result = parseHtml('<table><tr><td>Cell</td></tr></table>', [])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should parse heading with content', () => {
  const result = parseHtml('<h1>Title</h1>', [])
  expect(result).toHaveLength(2) // h1 and text
  expect(result[0].type).toBe(VirtualDomElements.H1)
})

test('parseHtml should parse multiple heading levels', () => {
  const result = parseHtml('<h1>H1</h1><h2>H2</h2><h3>H3</h3>', [])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should parse h1 with hello world content', () => {
  const result = parseHtml('<h1>hello world</h1>', [])
  expect(result).toHaveLength(2) // h1 and text
  expect(result[0].type).toBe(VirtualDomElements.H1)
  expect(result[0].childCount).toBe(1)
  expect(result[1]).toHaveProperty('text')
  expect(result[1].text).toBe('hello world')
})

test('parseHtml should parse h2 with live updating html content', () => {
  const result = parseHtml('<h2>this is live updating html</h2>', [])
  expect(result).toHaveLength(2) // h2 and text
  expect(result[0].type).toBe(VirtualDomElements.H2)
  expect(result[0].childCount).toBe(1)
  expect(result[1]).toHaveProperty('text')
  expect(result[1].text).toBe('this is live updating html')
})

test('parseHtml should parse combined h1 and h2 elements', () => {
  const result = parseHtml('<h1>hello world</h1>\n<h2>this is live updating html</h2>', [])
  expect(result.length).toBeGreaterThan(0)
  expect(result[0].type).toBe(VirtualDomElements.H1)
  // Find the h2 element in the result (whitespace between tags may create additional text nodes)
  const h2Element = result.find((node) => node.type === VirtualDomElements.H2)
  expect(h2Element).toBeDefined()
  // @ts-ignore
  expect(h2Element.type).toBe(VirtualDomElements.H2)
})

test('parseHtml should parse form structure', () => {
  const result = parseHtml('<form><input><button>Submit</button></form>', [])
  expect(result.length).toBeGreaterThan(0)
})

// Text with special characters tests
test('parseHtml should handle text with spaces', () => {
  const result = parseHtml('<div>Hello   World</div>', [])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should handle text with newlines', () => {
  const result = parseHtml('<div>Line1\nLine2</div>', [])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should handle text with tabs', () => {
  const result = parseHtml('<div>Text\twith\ttabs</div>', [])
  expect(result.length).toBeGreaterThan(0)
})

// Element-specific tests
test('parseHtml should parse anchor tag', () => {
  const result = parseHtml('<a href="https://example.com">Link</a>', ['href'])
  expect(result[0].type).toBe(VirtualDomElements.A)
  expect(result[0]['href']).toBe('https://example.com')
})

test('parseHtml should parse article tag', () => {
  const result = parseHtml('<article></article>', [])
  expect(result[0].type).toBe(VirtualDomElements.Article)
})

test('parseHtml should parse aside tag', () => {
  const result = parseHtml('<aside></aside>', [])
  expect(result[0].type).toBe(VirtualDomElements.Aside)
})

test('parseHtml should parse button tag', () => {
  const result = parseHtml('<button>Click</button>', [])
  expect(result[0].type).toBe(VirtualDomElements.Button)
})

test('parseHtml should parse header tag', () => {
  const result = parseHtml('<header></header>', [])
  expect(result[0].type).toBe(VirtualDomElements.Header)
})

test('parseHtml should parse footer tag', () => {
  const result = parseHtml('<footer></footer>', [])
  expect(result[0].type).toBe(VirtualDomElements.Footer)
})

test('parseHtml should parse main tag', () => {
  const result = parseHtml('<main></main>', [])
  // Main element is not in VirtualDomElements, defaults to Div
  expect(result[0].type).toBe(VirtualDomElements.Div)
})

test('parseHtml should parse nav tag', () => {
  const result = parseHtml('<nav></nav>', [])
  expect(result[0].type).toBe(VirtualDomElements.Nav)
})

test('parseHtml should parse section tag', () => {
  const result = parseHtml('<section></section>', [])
  expect(result[0].type).toBe(VirtualDomElements.Section)
})

// Text formatting tags
test('parseHtml should parse strong tag', () => {
  const result = parseHtml('<strong>Bold</strong>', [])
  // Strong element is not in VirtualDomElements, defaults to Div
  expect(result[0].type).toBe(VirtualDomElements.Div)
})

test('parseHtml should parse em tag', () => {
  const result = parseHtml('<em>Italic</em>', [])
  // Em element is not in VirtualDomElements, defaults to Div
  expect(result[0].type).toBe(VirtualDomElements.Div)
})

test('parseHtml should parse code tag', () => {
  const result = parseHtml('<code>const x = 1;</code>', [])
  expect(result[0].type).toBe(VirtualDomElements.Code)
})

test('parseHtml should parse pre tag', () => {
  const result = parseHtml('<pre>Preformatted</pre>', [])
  expect(result[0].type).toBe(VirtualDomElements.Pre)
})

// Mixed content tests
test('parseHtml should parse mixed text and elements', () => {
  const result = parseHtml('Text<div>Inside</div>More text', [])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should parse inline and block elements', () => {
  const result = parseHtml('<div><span>text</span></div>', [])
  expect(result.length).toBeGreaterThan(0)
})

// Edge cases
test('parseHtml should handle tag case insensitivity', () => {
  const result = parseHtml('<DIV></DIV>', [])
  expect(result).toHaveLength(1)
})

test('parseHtml should handle whitespace between tags', () => {
  const result = parseHtml('<div>  </div>', [])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should handle consecutive self-closing tags', () => {
  const result = parseHtml('<br><hr><br>', [])
  expect(result).toHaveLength(3)
})

test('parseHtml should ignore attributes not in allowedAttributes', () => {
  const allowedAttributes = ['data-valid']
  const result = parseHtml('<div data-valid="yes" data-invalid="no"></div>', allowedAttributes)
  expect(result[0]['data-valid']).toBe('yes')
  expect(result[0]['data-invalid']).toBeUndefined()
})

test('parseHtml should handle empty allowedAttributes array', () => {
  const result = parseHtml('<div id="test" class="cls"></div>', [])
  expect(result[0]['id']).toBeUndefined()
  expect(result[0]['class']).toBeUndefined()
  expect(result[0]['className']).toBeUndefined()
})

test('parseHtml should preserve attribute order when multiple allowed', () => {
  const result = parseHtml('<div data-first="1" data-second="2" data-third="3"></div>', ['data-first', 'data-second', 'data-third'])
  expect(result[0]['data-first']).toBe('1')
  expect(result[0]['data-second']).toBe('2')
  expect(result[0]['data-third']).toBe('3')
})

// Complex real-world examples
test('parseHtml should parse full card structure', () => {
  const html = `
    <div class="card">
      <div class="card-header">
        <h2>Title</h2>
      </div>
      <div class="card-body">
        <p>Content</p>
      </div>
      <div class="card-footer">
        <button>Action</button>
      </div>
    </div>
  `
  const result = parseHtml(html, ['class'])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should parse navigation menu', () => {
  const html = `
    <nav class="navbar">
      <ul class="nav-list">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  `
  const result = parseHtml(html, ['class', 'href'])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should parse article with metadata', () => {
  const html = `
    <article class="post" data-id="123">
      <header>
        <h1>Article Title</h1>
        <time>2024-01-15</time>
      </header>
      <main>
        <p>Article content goes here.</p>
      </main>
    </article>
  `
  const result = parseHtml(html, ['class', 'data-id'])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should maintain childCount property', () => {
  const result = parseHtml('<div><span></span><span></span></div>', [])
  expect(result[0].childCount).toBe(2)
})

test('parseHtml should handle void elements correctly', () => {
  const voidElements = [
    '<area>',
    '<base>',
    '<br>',
    '<col>',
    '<embed>',
    '<hr>',
    '<img>',
    '<input>',
    '<link>',
    '<meta>',
    '<param>',
    '<source>',
    '<track>',
    '<wbr>',
  ]
  for (const elem of voidElements) {
    const result = parseHtml(elem, [])
    expect(result).toHaveLength(1)
    expect(result[0]).toHaveProperty('type')
  }
})

test('parseHtml should handle semantic HTML5 elements', () => {
  const html = `
    <article>
      <header><h1>Topic</h1></header>
      <section>Content</section>
      <aside>Related</aside>
      <footer>Meta</footer>
    </article>
  `
  const result = parseHtml(html, [])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should handle data attributes', () => {
  const result = parseHtml('<div data-user-id="42" data-role="admin"></div>', ['data-user-id', 'data-role'])
  expect(result[0]['data-user-id']).toBe('42')
  expect(result[0]['data-role']).toBe('admin')
})

test('parseHtml should handle aria attributes', () => {
  const result = parseHtml('<div aria-label="Close" aria-hidden="true"></div>', ['aria-label', 'aria-hidden'])
  expect(result[0]['aria-label']).toBe('Close')
  expect(result[0]['aria-hidden']).toBe('true')
})

test('parseHtml should parse style attributes when allowed', () => {
  const result = parseHtml('<div style="color: red;"></div>', ['style'])
  expect(result[0]['style']).toBe('color: red;')
})

test('parseHtml should not parse style attributes when not allowed', () => {
  const result = parseHtml('<div style="color: red;"></div>', [])
  expect(result[0]['style']).toBeUndefined()
})

test('parseHtml should handle very long attribute values', () => {
  const longValue = 'x'.repeat(1000)
  const result = parseHtml(`<div data-long="${longValue}"></div>`, ['data-long'])
  expect(result[0]['data-long']).toBe(longValue)
})

test('parseHtml should handle many siblings', () => {
  let html = ''
  for (let i = 0; i < 100; i++) {
    html += `<div>Item ${i}</div>`
  }
  const result = parseHtml(html, [])
  expect(result.length).toBeGreaterThan(0)
})

test('parseHtml should handle deeply nested structure', () => {
  let html = '<div>'
  for (let i = 0; i < 50; i++) {
    html += '<div>'
  }
  html += 'Deep'
  for (let i = 0; i < 50; i++) {
    html += '</div>'
  }
  html += '</div>'
  const result = parseHtml(html, [])
  expect(result.length).toBeGreaterThan(0)
})
