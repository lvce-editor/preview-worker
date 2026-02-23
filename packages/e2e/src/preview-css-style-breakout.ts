import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-style-breakout'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-style-breakout.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Style Breakout Test</title>
  <style>
    #target {
      color: rgb(0, 0, 255);
    }

    } :root {
      background-color: rgb(255, 0, 0) !important;
    }
  </style>
</head>
<body>
  <div id="target">Styled via breakout style element</div>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('color', 'rgb(0, 0, 255)')

  const root = Locator('html')
  await expect(root).toHaveCSS('background-color', 'rgb(255, 0, 0)')
}
