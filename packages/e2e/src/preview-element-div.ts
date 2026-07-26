import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-div'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-div.html`
  await FileSystem.writeFile(filePath, '<!DOCTYPE html><html><body><div id="target-div" data-state="ready">Preview ready</div></body></html>')
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('div#target-div')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Preview ready')
  await expect(target).toHaveAttribute('data-state', 'ready')
}
