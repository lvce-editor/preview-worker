import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-textarea'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-textarea.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><textarea id="target-textarea" name="notes" rows="3" cols="24">Preview notes</textarea></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('textarea#target-textarea')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveAttribute('name', 'notes')
  await expect(target).toHaveAttribute('rows', '3')
  await expect(target).toHaveAttribute('cols', '24')
}
