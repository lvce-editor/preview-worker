import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-style-and-link-head-override'

export const skip = 1
export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-style-and-link-head-override.html`
  const cssPath = `${tmpDir}/preview-test-css-style-and-link-head-override.css`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>CSS Style Overridden by Link Test</title>
  <style>
    #target {
      color: rgb(0, 0, 255);
    }
  </style>
  <link rel="stylesheet" href="./preview-test-css-style-and-link-head-override.css">
</head>
<body>
  <div id="target">Style element overridden by linked stylesheet</div>
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
