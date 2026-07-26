import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-search'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-search.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><search id="target-search" class="preview-search">Search controls</search></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('#target-search')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Search controls')
  await expect(target).toHaveAttribute('class', 'preview-search')
}
