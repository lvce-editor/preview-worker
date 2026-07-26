import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-strong'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-strong.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><strong id="target-strong" class="important">Important preview</strong></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('strong#target-strong')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Important preview')
  await expect(target).toHaveAttribute('class', 'important')
}
