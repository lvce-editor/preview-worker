import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-figure'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-figure.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><figure id="target-figure" class="preview-result">Rendered figure</figure></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('figure#target-figure')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Rendered figure')
  await expect(target).toHaveAttribute('class', 'preview-result')
}
