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
    <rect id="target-rect" x="10" y="10" width="40" height="30" fill="rgb(30, 144, 255)"></rect>
    <polygon id="target-polygon" points="80,10 110,50 50,50" fill="rgb(255, 215, 0)"></polygon>
    <path id="target-path" d="M10 100 Q 50 60 90 100" stroke="rgb(0, 0, 0)" stroke-width="4" fill="none"></path>
    <circle id="target-circle" cx="130" cy="85" r="20" fill="rgb(255, 0, 0)"></circle>
  </svg>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const svg = previewArea.locator('#target-svg')
  await expect(svg).toBeVisible()
  await expect(svg).toHaveJSProperty('tagName', 'svg')
  await expect(svg).toHaveAttribute('viewBox', '0 0 160 120')

  const rect = previewArea.locator('#target-rect')
  await expect(rect).toBeVisible()
  await expect(rect).toHaveJSProperty('tagName', 'rect')

  const polygon = previewArea.locator('#target-polygon')
  await expect(polygon).toBeVisible()
  await expect(polygon).toHaveJSProperty('tagName', 'polygon')

  const path = previewArea.locator('#target-path')
  await expect(path).toBeVisible()
  await expect(path).toHaveJSProperty('tagName', 'path')

  const circle = previewArea.locator('#target-circle')
  await expect(circle).toBeVisible()
  await expect(circle).toHaveJSProperty('tagName', 'circle')
}
