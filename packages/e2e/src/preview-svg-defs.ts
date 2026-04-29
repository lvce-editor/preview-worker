import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.svg-defs'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-svg-defs.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <svg width="140" height="140" viewBox="0 0 140 140">
    <defs id="target-defs">
      <linearGradient id="gradient-a" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgb(255, 0, 0)"></stop>
        <stop offset="100%" stop-color="rgb(0, 0, 255)"></stop>
      </linearGradient>
    </defs>
    <rect id="gradient-rect" x="20" y="20" width="100" height="100" fill="url(#gradient-a)"></rect>
  </svg>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const defs = previewArea.locator('#target-defs')
  await expect(defs).toHaveCount(1)
  const gradient = previewArea.locator('#gradient-a')
  await expect(gradient).toHaveCount(1)
  const rect = previewArea.locator('#gradient-rect')
  await expect(rect).toBeVisible()
  await expect(rect).toHaveAttribute('fill', 'url(#gradient-a)')
}
