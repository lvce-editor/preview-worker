import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.tsx-basic-render'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-tsx-basic-${Date.now()}.tsx`
  const tsx = `export const Component = () => <h1 id="tsx-heading">Hello from TSX</h1>`

  await FileSystem.writeFile(filePath, tsx)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const heading = previewArea.locator('#tsx-heading')
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('Hello from TSX')
}
