import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-time'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-time.html`
  await FileSystem.writeFile(filePath, '<!DOCTYPE html><html><body><time id="target-time" class="published-at">July 26</time></body></html>')
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('time#target-time')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('July 26')
  await expect(target).toHaveAttribute('class', 'published-at')
}
