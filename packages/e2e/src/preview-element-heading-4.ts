import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-heading-4'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-heading-4.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><h4 id="target-heading-4" class="section-title">Fourth-level heading</h4></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('h4#target-heading-4')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Fourth-level heading')
  await expect(target).toHaveAttribute('class', 'section-title')
}
