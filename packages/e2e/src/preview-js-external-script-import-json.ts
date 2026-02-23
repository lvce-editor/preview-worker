import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.js-external-script-import-json'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-js-external-script-import-json.html`
  const modulePath = `${tmpDir}/preview-test-js-external-script-import-json.mjs`
  const jsonPath = `${tmpDir}/preview-test-js-external-script-import-json.json`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>External Script Import JSON Test</title>
</head>
<body>
  <div id="status">initial</div>
  <script type="module" src="./preview-test-js-external-script-import-json.mjs"></script>
  <script>
    document.getElementById('status').textContent = window.externalJsonImported ? 'json-imported' : 'external-not-loaded';
  </script>
</body>
</html>`

  const moduleScript = `import data from './preview-test-js-external-script-import-json.json' with { type: 'json' }
window.externalJsonImported = data && data.ok`

  const json = `{"ok":true}`

  await FileSystem.writeFile(modulePath, moduleScript)
  await FileSystem.writeFile(jsonPath, json)
  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const status = previewArea.locator('#status')
  await expect(status).toBeVisible()
  await expect(status).toHaveText('external-not-loaded')
}
