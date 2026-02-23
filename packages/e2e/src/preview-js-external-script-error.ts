import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.js-external-script-error'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-js-external-script-error.html`
  const externalScriptPath = `${tmpDir}/preview-test-js-external-script-error.js`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>External Script Error Test</title>
</head>
<body>
  <div id="status">initial</div>
  <script src="./preview-test-js-external-script-error.js"></script>
  <script>
    document.getElementById('status').textContent = window.externalErrorExecuted ? 'external-ran' : 'external-not-loaded';
  </script>
</body>
</html>`

  const externalScript = `window.externalErrorExecuted = true
throw new Error('external script should not execute')`

  await FileSystem.writeFile(externalScriptPath, externalScript)
  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const status = previewArea.locator('#status')
  await expect(status).toBeVisible()
  await expect(status).toHaveText('external-not-loaded')
}
