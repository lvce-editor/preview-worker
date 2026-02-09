import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.inner-width'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-innerwidth-innerheight-${Date.now()}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>InnerWidth and InnerHeight Test</title>
</head>
<body>
  <h1>Window Dimensions</h1>
  <p>innerWidth: <span id="innerWidth">-</span>px</p>
  <p>innerHeight: <span id="innerHeight">-</span>px</p>

  <script>
    document.getElementById('innerWidth').textContent = window.innerWidth;
    document.getElementById('innerHeight').textContent = window.innerHeight;
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  // act
  await Command.execute('Layout.showPreview', filePath)

  // assert
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const innerWidthSpan = previewArea.locator('#innerWidth')
  const innerHeightSpan = previewArea.locator('#innerHeight')

  await expect(innerWidthSpan).toBeVisible()
  await expect(innerHeightSpan).toBeVisible()

  // Verify innerWidth contains a number
  const innerWidthText = await innerWidthSpan.textContent()
  const innerWidth = Number.parseInt(innerWidthText || '', 10)
  expect(innerWidth).toBeGreaterThan(0)

  // Verify innerHeight contains a number
  const innerHeightText = await innerHeightSpan.textContent()
  const innerHeight = Number.parseInt(innerHeightText || '', 10)
  expect(innerHeight).toBeGreaterThan(0)
}
