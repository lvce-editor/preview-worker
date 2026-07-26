import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-footer'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-footer.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><footer id="target-footer" role="contentinfo">Preview footer</footer></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('footer#target-footer')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Preview footer')
  await expect(target).toHaveAttribute('role', 'contentinfo')
}
