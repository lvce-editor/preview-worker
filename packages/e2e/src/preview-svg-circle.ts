import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.svg-circle'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-svg-circle.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <svg width="120" height="120" viewBox="0 0 120 120">
    <circle id="target-circle" cx="60" cy="60" r="30" fill="rgb(255, 0, 0)"></circle>
  </svg>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target-circle')
  await expect(target).toBeVisible()
  await expect(target).toHaveAttribute('cx', '60')
  await expect(target).toHaveAttribute('cy', '60')
  await expect(target).toHaveAttribute('r', '30')
  await expect(target).toHaveAttribute('fill', 'rgb(255, 0, 0)')
}
