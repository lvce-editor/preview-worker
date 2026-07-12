import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-link-stylesheet-absolute-path-blocked'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-link-stylesheet-absolute-path-blocked.html`
  const blockedCssPath = `${tmpDir}/preview-test-css-link-stylesheet-absolute-path-blocked.css`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Absolute Path Stylesheet Blocked Test</title>
  <style>
    #target {
      color: rgb(0, 128, 0);
    }
  </style>
  <link rel="stylesheet" href="${blockedCssPath}">
</head>
<body>
  <div id="target">Absolute path stylesheet should be blocked</div>
</body>
</html>`

  const blockedCss = `#target {
  color: rgb(255, 0, 0);
}`

  await FileSystem.setFiles([
    { content: blockedCss, uri: blockedCssPath },
    { content: html, uri: filePath },
  ])
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('color', 'rgb(0, 128, 0)')
}
