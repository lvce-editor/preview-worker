import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-select-option'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-select-option.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><select><option id="target-option" value="second" label="Second choice">Second</option></select></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('option#target-option')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Second')
  await expect(target).toHaveAttribute('value', 'second')
  await expect(target).toHaveAttribute('label', 'Second choice')
}
