import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.js-external-script-data-uri-blocked'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-js-external-script-data-uri-blocked.html`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>External Script Data URI Blocked Test</title>
</head>
<body>
  <div id="status">initial</div>
  <script src="data:text/javascript,window.dataUriScriptLoaded%20%3D%20true"></script>
  <script>
    document.getElementById('status').textContent = window.dataUriScriptLoaded ? 'external-ran' : 'external-not-loaded';
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
