import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-article'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-article.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><article id="target-article" class="release-notes">Version 1.0</article></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('article#target-article')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Version 1.0')
  await expect(target).toHaveAttribute('class', 'release-notes')
}
