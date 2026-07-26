import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-heading-6'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-heading-6.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><h6 id="target-heading-6" class="section-title">Sixth-level heading</h6></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('h6#target-heading-6')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Sixth-level heading')
  await expect(target).toHaveAttribute('class', 'section-title')
}
