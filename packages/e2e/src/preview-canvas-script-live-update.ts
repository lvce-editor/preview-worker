import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-script-live-update'

const createHtml = (depth: number): string => {
  const branches = 2 ** depth - 1
  return `<!DOCTYPE html>
<html>
<body>
  <canvas id="tree" width="320" height="180"></canvas>
  <output id="status"></output>
  <script>
    const depth = ${depth}
    const canvas = document.getElementById('tree')
    const context = canvas.getContext('2d')
    context.fillStyle = '#718355'
    context.fillRect(0, 0, depth * 10, depth * 10)
    document.getElementById('status').textContent = '${branches} branches'
  </script>
</body>
</html>`
}

const waitForText = async (expect: any, locator: any, value: string): Promise<void> => {
  let lastError: unknown
  for (let i = 0; i < 40; i++) {
    try {
      await expect(locator).toContainText(value)
      return
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  throw lastError
}

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-canvas-script-live-update.html`
  await FileSystem.writeFile(filePath, createHtml(7))
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  const canvas = previewArea.locator('canvas')
  const status = previewArea.locator('#status')
  await expect(canvas).toBeVisible()
  await expect(status).toContainText('127 branches')

  await Editor.setText(createHtml(10))
  await waitForText(expect, status, '1023 branches')

  await Editor.setText(createHtml(8))
  await waitForText(expect, status, '255 branches')
}
