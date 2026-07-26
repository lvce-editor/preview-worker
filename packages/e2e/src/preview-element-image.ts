import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-image'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-image.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><img id="target-image" src="./missing-preview-image.png" alt="Preview placeholder" width="24" height="16"></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('img#target-image')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveAttribute('alt', 'Preview placeholder')
  await expect(target).toHaveAttribute('width', '24')
  await expect(target).toHaveAttribute('height', '16')
}
