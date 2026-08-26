import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.document-keydown-event'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-document-keydown-event.html`
  const html = `<!doctype html>
<html>
<body>
  <canvas id="game" width="360" height="600"></canvas>
  <p id="status">Ready</p>
  <script>
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        event.preventDefault()
        document.getElementById('status').textContent = 'Flying'
      }
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

  await Command.execute('Preview.handleKeyDown', '', ' ', 'Space')

  await expect(status).toHaveText('Flying')
}
