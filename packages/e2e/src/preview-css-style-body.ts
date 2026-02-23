import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-style-body'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-style-body.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Style in Body Test</title>
</head>
<body>
  <style>
    #target {
      border-top-width: 7px;
      border-top-style: solid;
      border-top-color: rgb(0, 0, 255);
    }
  </style>
  <div id="target">Styled via body style element</div>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('border-top-width', '7px')
}
