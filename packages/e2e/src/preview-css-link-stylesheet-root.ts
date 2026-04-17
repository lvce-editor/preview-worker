import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-link-stylesheet-root'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await SideBar.hide()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-link-stylesheet-root.html`
  const cssPath = `${tmpDir}/preview-test-css-link-stylesheet-root.css`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>CSS Link Root Selector Test</title>
  <link rel="stylesheet" href="./preview-test-css-link-stylesheet-root.css">
</head>
<body>
  <div id="target">Inherited color from root stylesheet</div>
</body>
</html>`

  const css = `:root {
  color: rgb(255, 0, 0);
}`

  await FileSystem.writeFile(cssPath, css)
  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('color', 'rgb(255, 0, 0)')

  const root = Locator('html')
  await expect(root).not.toHaveCSS('color', 'rgb(255, 0, 0)')
}