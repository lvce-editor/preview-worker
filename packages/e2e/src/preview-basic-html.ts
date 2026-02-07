import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.basic-html'

export const test: Test = async ({ Command, expect, FileSystem, Locator }) => {
  // Create a temporary HTML file with basic content
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}preview-test-basic-${Date.now()}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Basic HTML Test</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  const uri = filePath.replaceAll(/^\//, 'file:///')

  // Open the preview with the HTML file
  await Command.execute('Layout.showPreview', uri)

  // Wait for preview to render and verify the h1 element is visible
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  // Check that "Hello World" text is displayed in the preview
  const heading = previewArea.locator('h1')
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('Hello World')
}
