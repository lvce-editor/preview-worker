import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-aside'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-aside.html`
  await FileSystem.writeFile(filePath, '<!DOCTYPE html><html><body><aside id="target-aside" role="note">Related information</aside></body></html>')
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('aside#target-aside')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Related information')
  await expect(target).toHaveAttribute('role', 'note')
}
