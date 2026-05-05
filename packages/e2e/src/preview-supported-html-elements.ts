import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.supported-html-elements'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-supported-elements.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Supported HTML Elements Test</title>
</head>
<body>
  <a id="preview-a" href="#anchor">Anchor</a>
  <abbr id="preview-abbr" title="Abbreviation">Abbr</abbr>
  <article id="preview-article">Article</article>
  <aside id="preview-aside">Aside</aside>
  <br id="preview-br">
  <button id="preview-button">Button</button>
  <canvas id="preview-canvas" width="10" height="10"></canvas>
  <cite id="preview-cite">Citation</cite>
  <code id="preview-code">const x = 1</code>
  <data id="preview-data" value="123">Data</data>
  <del id="preview-del">Deleted</del>
  <div id="preview-div">Div</div>
  <dl id="preview-dl">
    <dt id="preview-dt">Term</dt>
    <dd id="preview-dd">Definition</dd>
  </dl>
  <figure id="preview-figure">
    <img id="preview-img" src="./image-does-not-need-to-exist.png" alt="Preview image">
    <figcaption id="preview-figcaption">Figure caption</figcaption>
  </figure>
  <footer id="preview-footer">Footer</footer>
  <form id="preview-form">
    <label id="preview-label" for="preview-input">Label</label>
    <input id="preview-input" type="text" value="preview value">
    <textarea id="preview-textarea">Textarea</textarea>
    <select id="preview-select">
      <option id="preview-option" value="one">Option</option>
    </select>
  </form>
  <h1 id="preview-h1">Heading 1</h1>
  <h2 id="preview-h2">Heading 2</h2>
  <h3 id="preview-h3">Heading 3</h3>
  <h4 id="preview-h4">Heading 4</h4>
  <h5 id="preview-h5">Heading 5</h5>
  <h6 id="preview-h6">Heading 6</h6>
  <header id="preview-header">Header</header>
  <hr id="preview-hr">
  <iframe id="preview-iframe" src="about:blank"></iframe>
  <nav id="preview-nav">Nav</nav>
  <ol id="preview-ol">
    <li id="preview-li">List item</li>
  </ol>
  <p id="preview-p">Paragraph</p>
  <pre id="preview-pre">Preformatted</pre>
  <search id="preview-search">Search</search>
  <section id="preview-section">Section</section>
  <span id="preview-span">Span</span>
  <table id="preview-table">
    <thead id="preview-thead">
      <tr id="preview-tr-head">
        <th id="preview-th">Head</th>
      </tr>
    </thead>
    <tbody id="preview-tbody">
      <tr id="preview-tr-body">
        <td id="preview-td">Cell</td>
      </tr>
    </tbody>
    <tfoot id="preview-tfoot">
      <tr id="preview-tr-foot">
        <td id="preview-td-foot">Foot</td>
      </tr>
    </tfoot>
  </table>
  <time id="preview-time" datetime="2026-05-05">May 5</time>
  <ul id="preview-ul">
    <li id="preview-li-ul">Bullet item</li>
  </ul>
</body>
</html>`

  const expectedSelectors = [
    'a#preview-a',
    'abbr#preview-abbr',
    'article#preview-article',
    'aside#preview-aside',
    'br#preview-br',
    'button#preview-button',
    'canvas#preview-canvas',
    'cite#preview-cite',
    'code#preview-code',
    'data#preview-data',
    'dd#preview-dd',
    'del#preview-del',
    'div#preview-div',
    'dl#preview-dl',
    'dt#preview-dt',
    'figcaption#preview-figcaption',
    'figure#preview-figure',
    'footer#preview-footer',
    'form#preview-form',
    'h1#preview-h1',
    'h2#preview-h2',
    'h3#preview-h3',
    'h4#preview-h4',
    'h5#preview-h5',
    'h6#preview-h6',
    'header#preview-header',
    'hr#preview-hr',
    'iframe#preview-iframe',
    'img#preview-img',
    'input#preview-input',
    'label#preview-label',
    'li#preview-li',
    'li#preview-li-ul',
    'nav#preview-nav',
    'ol#preview-ol',
    'option#preview-option',
    'p#preview-p',
    'pre#preview-pre',
    'search#preview-search',
    'section#preview-section',
    'select#preview-select',
    'span#preview-span',
    'table#preview-table',
    'tbody#preview-tbody',
    'td#preview-td',
    'td#preview-td-foot',
    'textarea#preview-textarea',
    'tfoot#preview-tfoot',
    'th#preview-th',
    'thead#preview-thead',
    'time#preview-time',
    'tr#preview-tr-head',
    'tr#preview-tr-body',
    'tr#preview-tr-foot',
    'ul#preview-ul',
  ]

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  for (const selector of expectedSelectors) {
    await expect(previewArea.locator(selector)).toHaveCount(1)
  }

  await expect(previewArea.locator('button#preview-button')).toContainText('Button')
  await expect(previewArea.locator('input#preview-input')).toHaveValue('preview value')
  await expect(previewArea.locator('textarea#preview-textarea')).toHaveValue('Textarea')
  await expect(previewArea.locator('a#preview-a')).toContainText('Anchor')
}
