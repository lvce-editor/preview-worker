import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-navigation'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-navigation.html`
  await FileSystem.writeFile(filePath, '<!DOCTYPE html><html><body><nav id="target-navigation" class="preview-links">Navigation</nav></body></html>')
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('nav#target-navigation')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Navigation')
  await expect(target).toHaveAttribute('class', 'preview-links')
}
