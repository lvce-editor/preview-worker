import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.svg-rect'
export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-svg-rect.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <svg width="140" height="100" viewBox="0 0 140 100">
    <rect id="target-rect" x="20" y="20" width="100" height="60" rx="8" fill="rgb(30, 144, 255)"></rect>
  </svg>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target-rect')
  await expect(target).toBeVisible()
  await expect(target).toHaveJSProperty('tagName', 'rect')
  await expect(target).toHaveAttribute('width', '100')
  await expect(target).toHaveAttribute('height', '60')
  await expect(target).toHaveAttribute('rx', '8')
}
