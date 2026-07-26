import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-description-list'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-description-list.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><dl><dt>Worker</dt><dd id="target-description" class="definition">Preview renderer</dd></dl></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('dd#target-description')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Preview renderer')
  await expect(target).toHaveAttribute('class', 'definition')
}
