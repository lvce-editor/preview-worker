import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-preformatted'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-preformatted.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><pre id="target-preformatted" class="code-block">line one\nline two</pre></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('pre#target-preformatted')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('line one\nline two')
  await expect(target).toHaveAttribute('class', 'code-block')
}
