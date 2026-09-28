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
      --bg: #0f172a;
      --panel: rgba(15, 23, 42, 0.72);
      --text: #e2e8f0;
    }

    body {
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(56, 189, 248, 0.22), transparent 35%),
        linear-gradient(180deg, #020617 0%, var(--bg) 100%);
      min-height: 100vh;
    }

    #${targetId} {
      color: var(--text);
      background-color: var(--panel);
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
  const body = previewArea.locator('.Preview .Html .Body')
  await expect(target).toBeVisible()
  await expect(body).toHaveCSS('color', 'rgb(226, 232, 240)')
  await expect(body).toHaveCSS(
    'background-image',
    'radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.22), rgba(0, 0, 0, 0) 35%), linear-gradient(rgb(2, 6, 23) 0%, rgb(15, 23, 42) 100%)',
  )
  await expect(target).toHaveCSS('color', 'rgb(226, 232, 240)')
  await expect(target).toHaveCSS('background-color', 'rgba(15, 23, 42, 0.72)')
}
