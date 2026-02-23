import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.js-external-script-fetch-data'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-js-external-script-fetch-data.html`
  const externalScriptPath = `${tmpDir}/preview-test-js-external-script-fetch-data.js`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>External Script Fetch Data Test</title>
</head>
<body>
  <div id="status">initial</div>
  <script src="./preview-test-js-external-script-fetch-data.js"></script>
  <script>
    document.getElementById('status').textContent = window.externalFetchAttempted ? 'fetch-attempted' : 'external-not-loaded';
  </script>
</body>
</html>`

  const externalScript = `window.externalFetchAttempted = true
fetch('https://example.com/data.json').catch(() => {})`

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
