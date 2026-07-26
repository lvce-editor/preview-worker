import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-header'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-header.html`
  await FileSystem.writeFile(filePath, '<!DOCTYPE html><html><body><header id="target-header" role="banner">Preview header</header></body></html>')
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('#target-header')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Preview header')
  await expect(target).toHaveAttribute('role', 'banner')
}
