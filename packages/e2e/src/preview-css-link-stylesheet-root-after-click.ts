import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-link-stylesheet-root-after-click'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await SideBar.hide()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-link-stylesheet-root-after-click.html`
  const cssPath = `${tmpDir}/preview-test-css-link-stylesheet-root-after-click.css`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>CSS Link Root Stylesheet After Click Test</title>
  <link rel="stylesheet" href="./preview-test-css-link-stylesheet-root-after-click.css">
</head>
<body>
  <div id="target">Inherited from linked root rule</div>
  <button id="playBtn">Play</button>
  <script>
    document.getElementById('playBtn').addEventListener('click', () => {
      document.getElementById('target').textContent = 'Game started';
    })
  </script>
</body>
</html>`

  const css = `:root {
  color: rgb(255, 0, 0);
}`

  await FileSystem.writeFile(cssPath, css)
  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveText('Inherited from linked root rule')
  await expect(target).toHaveCSS('color', 'rgb(255, 0, 0)')

  const mutationPromise = Command.execute('Preview.waitForMutation', { selector: '#target', timeout: 5000 })
  await Command.execute('Preview.handleClick', '1')
  await mutationPromise

  await expect(target).toHaveText('Game started')
  await expect(target).toHaveCSS('color', 'rgb(255, 0, 0)')

  const root = Locator('html')
  await expect(root).not.toHaveCSS('color', 'rgb(255, 0, 0)')
}
