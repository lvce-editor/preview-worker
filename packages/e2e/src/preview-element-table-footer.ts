import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-table-footer'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-table-footer.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><table><tfoot id="target-table-footer" class="preview-summary"><tr><td>Summary</td></tr></tfoot></table></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('tfoot#target-table-footer')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Summary')
  await expect(target).toHaveAttribute('class', 'preview-summary')
}
