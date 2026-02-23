import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-link-stylesheet-protocol-relative-blocked'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-link-stylesheet-protocol-relative-blocked.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Protocol Relative Stylesheet Blocked Test</title>
  <style>
    #target {
      color: rgb(0, 128, 0);
    }
  </style>
  <link rel="stylesheet" href="//example.com/should-not-load.css">
</head>
<body>
  <div id="target">Preview should render with protocol-relative stylesheet blocked</div>
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
