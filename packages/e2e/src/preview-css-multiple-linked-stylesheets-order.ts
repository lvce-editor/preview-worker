import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-multiple-linked-stylesheets-order'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await SideBar.hide()
  await Workspace.setPath(tmpDir)

  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const targetId = `target-${uniqueId}`
  const firstCssFileName = `preview-test-multiple-stylesheets-first-${uniqueId}.css`
  const secondCssFileName = `preview-test-multiple-stylesheets-second-${uniqueId}.css`
  const filePath = `${tmpDir}/preview-test-multiple-stylesheets-order-${uniqueId}.html`
  const firstCssPath = `${tmpDir}/${firstCssFileName}`
  const secondCssPath = `${tmpDir}/${secondCssFileName}`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Multiple Stylesheets Order Test</title>
  <link rel="stylesheet" href="./${firstCssFileName}">
  <link rel="stylesheet" href="./${secondCssFileName}">
</head>
<body>
  <div id="${targetId}">Stylesheet order is preserved</div>
</body>
</html>`

  const firstCss = `#${targetId} {
  color: rgb(255, 0, 0);
}`

  const secondCss = `#${targetId} {
  color: rgb(0, 0, 255);
}`

  await FileSystem.writeFile(firstCssPath, firstCss)
  await FileSystem.writeFile(secondCssPath, secondCss)
  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator(`#${targetId}`)
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('color', 'rgb(0, 0, 255)')
}