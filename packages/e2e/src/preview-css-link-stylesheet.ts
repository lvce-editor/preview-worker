import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-link-stylesheet'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await SideBar.hide()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-link-stylesheet.html`
  const cssPath = `${tmpDir}/preview-test-css-link-stylesheet.css`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>CSS Link Stylesheet Test</title>
  <link rel="stylesheet" href="./preview-test-css-link-stylesheet.css">
</head>
<body>
  <div id="target">Styled via linked stylesheet</div>
</body>
</html>`

  const css = `#target {
  color: rgb(255, 0, 0);
}`

  await FileSystem.setFiles([
    { content: css, uri: cssPath },
    { content: html, uri: filePath },
  ])
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('color', 'rgb(255, 0, 0)')
}
