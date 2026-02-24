import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-link-stylesheet-live-update'

export const skip = 1

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await SideBar.hide()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-link-stylesheet-live-update.html`
  const cssPath = `${tmpDir}/preview-test-css-link-stylesheet-live-update.css`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>CSS Link Live Update Test</title>
  <link rel="stylesheet" href="./preview-test-css-link-stylesheet-live-update.css">
</head>
<body>
  <div id="target">Styled via linked stylesheet</div>
</body>
</html>`

  const initialCss = `#target {
  color: rgb(255, 0, 0);
}`

  const updatedCss = `#target {
  color: rgb(0, 0, 255);
}`

  await FileSystem.writeFile(cssPath, initialCss)
  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('color', 'rgb(255, 0, 0)')

  await Main.openUri(cssPath)
  await Editor.setText(updatedCss)
  await Main.save()

  await expect(target).toHaveCSS('color', 'rgb(0, 0, 255)')
}
