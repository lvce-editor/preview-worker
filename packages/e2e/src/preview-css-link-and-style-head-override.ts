import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-link-and-style-head-override'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-link-and-style-head-override.html`
  const cssPath = `${tmpDir}/preview-test-css-link-and-style-head-override.css`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>CSS Link Overridden by Style Test</title>
  <link rel="stylesheet" href="./preview-test-css-link-and-style-head-override.css">
  <style>
    #target {
      color: rgb(0, 0, 255);
    }
  </style>
</head>
<body>
  <div id="target">Link stylesheet overridden by style element</div>
</body>
</html>`

  const css = `#target {
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
  await expect(target).toHaveCSS('color', 'rgb(0, 0, 255)')
}
