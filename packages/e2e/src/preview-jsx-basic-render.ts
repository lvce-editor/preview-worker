import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.jsx-basic-render'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-jsx-basic-${Date.now()}.jsx`
  const jsx = `export const Component = () => <h1 id="jsx-heading">Hello from JSX</h1>`

  await FileSystem.writeFile(filePath, jsx)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const heading = previewArea.locator('#jsx-heading')
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('Hello from JSX')
}
