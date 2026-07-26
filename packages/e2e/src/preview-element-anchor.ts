import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-anchor'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-anchor.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><a id="target-anchor" href="#details" title="Jump to details">Details</a></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('a#target-anchor')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Details')
  await expect(target).toHaveAttribute('href', '#details')
  await expect(target).toHaveAttribute('title', 'Jump to details')
}
