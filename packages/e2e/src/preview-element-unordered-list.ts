import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-unordered-list'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-unordered-list.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><ul id="target-unordered-list" class="preview-items"><li>First item</li></ul></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('ul#target-unordered-list')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('First item')
  await expect(target).toHaveAttribute('class', 'preview-items')
}
