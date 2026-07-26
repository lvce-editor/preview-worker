import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-code'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-code.html`
  await FileSystem.writeFile(filePath, '<!DOCTYPE html><html><body><code id="target-code" class="language-js">const answer = 42</code></body></html>')
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('code#target-code')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('const answer = 42')
  await expect(target).toHaveAttribute('class', 'language-js')
}
