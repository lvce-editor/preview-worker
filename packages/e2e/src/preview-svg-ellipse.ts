import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.svg-ellipse'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-svg-ellipse.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <svg width="140" height="100" viewBox="0 0 140 100">
    <ellipse id="target-ellipse" cx="70" cy="50" rx="45" ry="25" fill="rgb(0, 128, 0)"></ellipse>
  </svg>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target-ellipse')
  await expect(target).toBeVisible()
  await expect(target).toHaveAttribute('cx', '70')
  await expect(target).toHaveAttribute('cy', '50')
  await expect(target).toHaveAttribute('rx', '45')
  await expect(target).toHaveAttribute('ry', '25')
}
