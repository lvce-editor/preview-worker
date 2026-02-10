import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.error-message'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-error-message.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Error Message Test</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`
  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  // act
  await Command.execute('Preview.setErrorMessage', 'Something went wrong')

  // assert
  const errorMessage = previewArea.locator('.PreviewErrorMessage')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toContainText('Something went wrong')
}
