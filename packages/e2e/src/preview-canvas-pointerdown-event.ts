import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-pointerdown-event'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-canvas-pointerdown-event.html`
  const html = `<!doctype html>
<html>
<body>
  <canvas id="game" width="360" height="600"></canvas>
  <p id="status">Ready</p>
  <script>
    const canvas = document.getElementById('game')
    canvas.addEventListener('pointerdown', () => {
      document.getElementById('status').textContent = 'Flying'
    })
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  const canvas = previewArea.locator('#game')
  const status = previewArea.locator('#status')
  await expect(canvas).toBeVisible()
  await expect(status).toHaveText('Ready')

  await canvas.dispatchEvent('pointerdown', { bubbles: true, clientX: 20, clientY: 20, pointerId: 1, pointerType: 'mouse' })

  await expect(status).toHaveText('Flying')
}
