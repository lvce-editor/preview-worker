import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.svg-path'
export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-svg-path.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <svg width="140" height="100" viewBox="0 0 140 100">
    <path id="target-path" d="M10 80 Q 70 10 130 80" stroke="rgb(0, 0, 0)" stroke-width="4" fill="none"></path>
  </svg>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target-path')
  await expect(target).toBeVisible()
  await expect(target).toHaveJSProperty('tagName', 'path')
  await expect(target).toHaveAttribute('d', 'M10 80 Q 70 10 130 80')
  await expect(target).toHaveAttribute('fill', 'none')
}
