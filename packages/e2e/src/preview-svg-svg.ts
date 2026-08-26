import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.svg-svg'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-svg-svg.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <svg id="target-svg" width="160" height="120" viewBox="0 0 160 120">
    <rect x="10" y="10" width="140" height="100" fill="rgb(240, 240, 240)" stroke="rgb(0, 0, 0)"></rect>
  </svg>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('svg#target-svg')
  await expect(target).toBeVisible()
  await expect(target).toHaveAttribute('width', '160')
  await expect(target).toHaveAttribute('height', '120')
  await expect(target).toHaveAttribute('viewBox', '0 0 160 120')
}
