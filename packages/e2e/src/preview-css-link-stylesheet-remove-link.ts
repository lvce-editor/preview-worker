import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-link-stylesheet-remove-link'

export const skip = 1

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await SideBar.hide()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-link-stylesheet-remove-link.html`
  const cssPath = `${tmpDir}/preview-test-css-link-stylesheet-remove-link.css`

  const htmlWithLink = `<!DOCTYPE html>
<html>
<head>
  <title>CSS Link Removal Test</title>
  <link rel="stylesheet" href="./preview-test-css-link-stylesheet-remove-link.css">
</head>
<body>
  <div id="target">Styled via linked stylesheet</div>
</body>
</html>`

  const htmlWithoutLink = `<!DOCTYPE html>
<html>
<head>
  <title>CSS Link Removal Test</title>
</head>
<body>
  <div id="target">Styled via linked stylesheet</div>
</body>
</html>`

  const css = `#target {
  color: rgb(255, 0, 0);
}`

  await FileSystem.writeFile(cssPath, css)
  await FileSystem.writeFile(filePath, htmlWithLink)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('color', 'rgb(255, 0, 0)')

  await Editor.setText(htmlWithoutLink)
  await Main.save()

  await expect(target).not.toHaveCSS('color', 'rgb(255, 0, 0)')
}
