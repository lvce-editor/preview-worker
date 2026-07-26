import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-deleted-text'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-deleted-text.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><del id="target-deleted-text" class="outdated" cite="changelog.html">Old behavior</del></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('del#target-deleted-text')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Old behavior')
  await expect(target).toHaveAttribute('cite', 'changelog.html')
  await expect(target).toHaveAttribute('class', 'outdated')
}
