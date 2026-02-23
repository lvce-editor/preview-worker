import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-link-stylesheet-data-uri-blocked'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-link-stylesheet-data-uri-blocked.html`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Data URI Stylesheet Blocked Test</title>
  <style>
    #target {
      color: rgb(0, 128, 0);
    }
  </style>
  <link rel="stylesheet" href="data:text/css,%23target%20%7B%20color%3A%20rgb(255%2C%200%2C%200)%3B%20%7D">
</head>
<body>
  <div id="target">Data URI stylesheet should be blocked</div>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('color', 'rgb(0, 128, 0)')
}
