import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-horizontal-rule'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-horizontal-rule.html`
  await FileSystem.writeFile(filePath, '<!DOCTYPE html><html><body><hr id="target-horizontal-rule" class="section-separator"></body></html>')
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('hr#target-horizontal-rule')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveAttribute('class', 'section-separator')
}
