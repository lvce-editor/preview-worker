import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-definition-term'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-definition-term.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><dl><dt id="target-definition-term" class="term">Worker</dt><dd>Preview renderer</dd></dl></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('dt#target-definition-term')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Worker')
  await expect(target).toHaveAttribute('class', 'term')
}
