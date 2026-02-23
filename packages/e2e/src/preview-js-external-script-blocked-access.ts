import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.js-external-script-blocked-access'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-js-external-script-blocked-access.html`
  const blockedScriptPath = `${tmpDir}/preview-test-js-external-script-blocked-access.js`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>External Script Blocked Access Test</title>
</head>
<body>
  <div id="status">initial</div>
  <script src="${blockedScriptPath}"></script>
  <script>
    document.getElementById('status').textContent = window.absoluteScriptLoaded ? 'external-ran' : 'external-not-loaded';
  </script>
</body>
</html>`

  const blockedScript = `window.absoluteScriptLoaded = true`

  await FileSystem.writeFile(blockedScriptPath, blockedScript)
  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const status = previewArea.locator('#status')
  await expect(status).toBeVisible()
  await expect(status).toHaveText('external-not-loaded')
}
