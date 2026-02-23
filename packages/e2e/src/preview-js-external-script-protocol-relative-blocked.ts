import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.js-external-script-protocol-relative-blocked'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-js-external-script-protocol-relative-blocked.html`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>External Script Protocol Relative Blocked Test</title>
</head>
<body>
  <div id="status">initial</div>
  <script src="//example.com/blocked-script.js"></script>
  <script>
    document.getElementById('status').textContent = window.protocolRelativeScriptLoaded ? 'external-ran' : 'external-not-loaded';
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
