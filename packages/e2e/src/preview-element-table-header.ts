import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-table-header'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-table-header.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><table><thead id="target-table-header" class="preview-columns"><tr><th>Heading</th></tr></thead></table></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('thead#target-table-header')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Heading')
  await expect(target).toHaveAttribute('class', 'preview-columns')
}
