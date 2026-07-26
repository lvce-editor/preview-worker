import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-data'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-data.html`
  await FileSystem.writeFile(filePath, '<!DOCTYPE html><html><body><data id="target-data" value="sku-42">Preview package</data></body></html>')
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('#target-data')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Preview package')
  await expect(target).toHaveAttribute('value', 'sku-42')
}
