import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-button'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-button.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><button id="target-button" class="run-preview" type="button">Run preview</button></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const target = Locator('.Viewlet.Preview').locator('button#target-button')
  await expect(target).toHaveCount(1)
  await expect(target).toHaveText('Run preview')
  await expect(target).toHaveAttribute('type', 'button')
  await expect(target).toHaveAttribute('class', 'run-preview')
}
