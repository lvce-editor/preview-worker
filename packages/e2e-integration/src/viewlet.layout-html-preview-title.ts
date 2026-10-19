import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.layout-html-preview-title'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setUri(tmpDir)
  const first = `${tmpDir}/first.html`
  const second = `${tmpDir}/second.html`
  await FileSystem.writeFile(first, '<title>Initial title</title><p id="first">Initial body</p>')
  await FileSystem.writeFile(second, '<title>Second title</title><p id="second">Second body</p>')

  await Main.openUri(first)
  await Command.execute('Layout.showPreview', first)
  const preview = Locator('.SimpleBrowser .Preview')
  await expect(preview.locator('#first')).toHaveText('Initial body')
  await expect(Locator('.SimpleBrowserTabTitle').nth(0)).toHaveText('Initial title')

  await Editor.setText('<title>Single updated</title><p id="first">Single body</p>')
  await expect(Locator('.SimpleBrowserTabTitle').nth(0)).toHaveText('Single updated')
  await expect(preview.locator('#first')).toHaveText('Single body')
  await Command.execute('Layout.showPreview', second)
  await expect(Locator('.SimpleBrowserTab')).toHaveCount(2)
  await expect(Locator('.SimpleBrowserTabTitle').nth(0)).toHaveText('Single updated')
  await expect(Locator('.SimpleBrowserTabTitle').nth(1)).toHaveText('Second title')

  await Editor.setText('<title>Updated title</title><p id="first">Updated body</p>')
  await expect(Locator('.SimpleBrowserTabTitle').nth(0)).toHaveText('Updated title')
  await expect(Locator('.SimpleBrowserTabTitle').nth(1)).toHaveText('Second title')

  await Editor.setText('<title>Title only</title><p id="first">Updated body</p>')
  await expect(Locator('.SimpleBrowserTabTitle').nth(0)).toHaveText('Title only')
  await Editor.setText('<title> </title><p id="first">Updated body</p>')
  await expect(Locator('.SimpleBrowserTabTitle').nth(0)).toHaveText('HTML Preview')
  await expect(Locator('.SimpleBrowserTabTitle').nth(1)).toHaveText('Second title')
  await Editor.setText('<title>Updated title</title><p id="first">Updated body</p>')
  await expect(Locator('.SimpleBrowserTabTitle').nth(0)).toHaveText('Updated title')

  await Command.execute('SimpleBrowser.selectTab', 0)
  await expect(preview.locator('#first')).toHaveText('Updated body')
  await Command.execute('SimpleBrowser.selectTab', 1)
  await expect(preview.locator('#second')).toHaveText('Second body')
  await expect(Locator('.SimpleBrowserTabTitle').nth(0)).toHaveText('Updated title')
  await expect(Locator('.SimpleBrowserTabTitle').nth(1)).toHaveText('Second title')
}
