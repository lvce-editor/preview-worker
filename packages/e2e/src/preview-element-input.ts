import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-input'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-input.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><input id="target-input" type="text" name="query" placeholder="Search preview"></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('input#target-input')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveAttribute('type', 'text')
  await expect(target).toHaveAttribute('name', 'query')
  await expect(target).toHaveAttribute('placeholder', 'Search preview')
}
