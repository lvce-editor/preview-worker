import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-heading-3'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-heading-3.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><h3 id="target-heading-3" class="section-title">Third-level heading</h3></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('h3#target-heading-3')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Third-level heading')
  await expect(target).toHaveAttribute('class', 'section-title')
}
