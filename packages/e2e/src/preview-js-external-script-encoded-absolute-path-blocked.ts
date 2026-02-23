import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.js-external-script-encoded-absolute-path-blocked'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-js-external-script-encoded-absolute-path-blocked.html`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>External Script Encoded Absolute Path Blocked Test</title>
</head>
<body>
  <div id="status">initial</div>
  <script src="%2Fetc%2Fpasswd.js"></script>
  <script>
    document.getElementById('status').textContent = window.encodedAbsolutePathScriptLoaded ? 'external-ran' : 'external-not-loaded';
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const status = previewArea.locator('#status')
  await expect(status).toBeVisible()
  await expect(status).toHaveText('external-not-loaded')
}
