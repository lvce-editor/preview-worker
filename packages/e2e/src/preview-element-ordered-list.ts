import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-ordered-list'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-ordered-list.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><ol id="target-ordered-list" start="3" reversed><li>Third item</li></ol></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('ol#target-ordered-list')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Third item')
  await expect(target).toHaveAttribute('start', '3')
  await expect(target).toHaveAttribute('reversed', '')
}
