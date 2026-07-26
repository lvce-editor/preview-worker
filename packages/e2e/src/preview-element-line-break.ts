import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-line-break'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-line-break.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><p>First line<br id="target-line-break" class="content-break">Second line</p></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('br#target-line-break')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveAttribute('class', 'content-break')
}
