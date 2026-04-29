import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.svg-polyline'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-svg-polyline.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <svg width="160" height="100" viewBox="0 0 160 100">
    <polyline id="target-polyline" points="10,80 50,20 90,80 130,20 150,60" fill="none" stroke="rgb(0, 128, 128)" stroke-width="4"></polyline>
  </svg>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target-polyline')
  await expect(target).toBeVisible()
  await expect(target).toHaveAttribute('points', '10,80 50,20 90,80 130,20 150,60')
  await expect(target).toHaveAttribute('fill', 'none')
}
