import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.element-em-i'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-element-em-i.html`
  await FileSystem.writeFile(
    filePath,
    '<!DOCTYPE html><html><body><p id="parent" class="copy">before <em id="emphasis" class="em">emphasis</em> middle <i id="italic" class="i">italic</i> after</p></body></html>',
  )
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const preview = Locator('.Viewlet.Preview')
  const paragraph = preview.locator('p#parent.copy')
  const emphasis = paragraph.locator('em#emphasis.em')
  const italic = paragraph.locator('i#italic.i')
  await expect(paragraph).toHaveCount(1)
  await expect(paragraph).toHaveText('before emphasis middle italic after')
  await expect(emphasis).toHaveCount(1)
  await expect(emphasis).toHaveText('emphasis')
  await expect(emphasis).toHaveCSS('font-style', 'italic')
  await expect(italic).toHaveCount(1)
  await expect(italic).toHaveText('italic')
  await expect(italic).toHaveCSS('font-style', 'italic')
}
