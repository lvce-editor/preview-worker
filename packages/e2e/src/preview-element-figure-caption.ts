import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-figure-caption'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-figure-caption.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><figure><figcaption id="target-figure-caption" class="caption">Rendered output</figcaption></figure></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('figcaption#target-figure-caption')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Rendered output')
  await expect(target).toHaveAttribute('class', 'caption')
}
