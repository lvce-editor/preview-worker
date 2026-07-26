import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-paragraph'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-paragraph.html`
  await FileSystem.writeFile(filePath, '<!DOCTYPE html><html><body><p id="target-paragraph" lang="en">Preview paragraph</p></body></html>')
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('p#target-paragraph')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Preview paragraph')
  await expect(target).toHaveAttribute('lang', 'en')
}
