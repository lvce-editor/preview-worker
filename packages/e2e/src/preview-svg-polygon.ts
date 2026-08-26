import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.svg-polygon'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-svg-polygon.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <svg width="140" height="120" viewBox="0 0 140 120">
    <polygon id="target-polygon" points="70,10 130,110 10,110" fill="rgb(255, 215, 0)"></polygon>
  </svg>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('polygon#target-polygon')
  await expect(target).toBeVisible()
  await expect(target).toHaveAttribute('points', '70,10 130,110 10,110')
  await expect(target).toHaveAttribute('fill', 'rgb(255, 215, 0)')
}
