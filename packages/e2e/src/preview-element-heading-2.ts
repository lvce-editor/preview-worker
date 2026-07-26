import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-heading-2'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-heading-2.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><h2 id="target-heading-2" class="section-title">Second-level heading</h2></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('h2#target-heading-2')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Second-level heading')
  await expect(target).toHaveAttribute('class', 'section-title')
}
