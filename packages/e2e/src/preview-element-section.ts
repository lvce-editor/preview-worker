import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-section'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-section.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><section id="target-section" class="preview-section">Section content</section></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('section#target-section')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Section content')
  await expect(target).toHaveAttribute('class', 'preview-section')
}
