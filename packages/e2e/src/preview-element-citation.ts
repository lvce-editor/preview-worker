import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-citation'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-citation.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><cite id="target-citation" title="Example publication">The Preview Guide</cite></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('cite#target-citation')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('The Preview Guide')
  await expect(target).toHaveAttribute('title', 'Example publication')
}
