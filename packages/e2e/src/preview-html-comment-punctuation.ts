import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.html-comment-punctuation'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-html-comment-punctuation.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <h1>City in Daylight</h1>
  <!-- Pedestrians use staggered, separate sidewalk bands: the rear pair
       travels above the far lane and the foreground pair above the near
       lane, preventing visual collisions with either car. -->
  <p>Bright daytime city landscape</p>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  await expect(previewArea.locator('h1')).toContainText('City in Daylight')
  await expect(previewArea.locator('p')).toContainText('Bright daytime city landscape')
}
