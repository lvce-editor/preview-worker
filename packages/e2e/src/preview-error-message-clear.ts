import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.error-message-clear'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-error-clear.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Error Message Clear Test</title>
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
  await Command.execute('Preview.setErrorMessage', 'Something went wrong')
  const errorMessage = previewArea.locator('.PreviewErrorMessage')
  await expect(errorMessage).toContainText('Something went wrong')

  // act
  await Command.execute('Preview.setErrorMessage', '')

  // assert
  await expect(errorMessage).toHaveText('')
}
