import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-table-body'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-table-body.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><table><tbody id="target-table-body" class="preview-rows"><tr><td>Body cell</td></tr></tbody></table></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('tbody#target-table-body')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Body cell')
  await expect(target).toHaveAttribute('class', 'preview-rows')
}
