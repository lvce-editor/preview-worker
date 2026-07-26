import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-span'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-span.html`
  await FileSystem.writeFile(filePath, '<!DOCTYPE html><html><body><span id="target-span" data-kind="status">Ready</span></body></html>')
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('span#target-span')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Ready')
  await expect(target).toHaveAttribute('data-kind', 'status')
}
