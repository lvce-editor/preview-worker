import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.svg-g'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-svg-g.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <svg width="120" height="120" viewBox="0 0 120 120">
    <g id="target-group" transform="translate(10 10)">
      <rect id="group-rect" x="0" y="0" width="40" height="40" fill="rgb(255, 165, 0)"></rect>
      <circle cx="70" cy="20" r="15" fill="rgb(0, 0, 255)"></circle>
    </g>
  </svg>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target-group')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveAttribute('transform', 'translate(10 10)')
  const rect = previewArea.locator('#group-rect')
  await expect(rect).toBeVisible()
}
