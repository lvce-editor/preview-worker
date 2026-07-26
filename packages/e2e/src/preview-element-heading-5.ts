import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-heading-5'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-heading-5.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><h5 id="target-heading-5" class="section-title">Fifth-level heading</h5></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('h5#target-heading-5')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Fifth-level heading')
  await expect(target).toHaveAttribute('class', 'section-title')
}
