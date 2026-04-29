import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.svg-line'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-svg-line.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <svg width="140" height="80" viewBox="0 0 140 80">
    <line id="target-line" x1="10" y1="10" x2="130" y2="70" stroke="rgb(128, 0, 128)" stroke-width="6"></line>
  </svg>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target-line')
  await expect(target).toBeVisible()
  await expect(target).toHaveAttribute('x1', '10')
  await expect(target).toHaveAttribute('y1', '10')
  await expect(target).toHaveAttribute('x2', '130')
  await expect(target).toHaveAttribute('y2', '70')
}
