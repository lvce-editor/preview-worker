import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-label'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-label.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><label id="target-label" class="field-label">Preview name</label><input id="preview-name"></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('label#target-label')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Preview name')
  await expect(target).toHaveAttribute('class', 'field-label')
}
