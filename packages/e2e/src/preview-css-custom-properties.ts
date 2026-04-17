import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-custom-properties'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const targetId = `target-${uniqueId}`
  const filePath = `${tmpDir}/preview-test-css-custom-properties-${uniqueId}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>CSS Custom Properties Test</title>
  <style>
    :root {
      --accent-color: rgb(12, 34, 56);
    }

    #${targetId} {
      color: var(--accent-color);
    }
  </style>
</head>
<body>
  <div id="${targetId}">Styled with CSS variables</div>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator(`#${targetId}`)
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('color', 'rgb(12, 34, 56)')
}