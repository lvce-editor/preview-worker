import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.script-src-relative'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const htmlPath = `${tmpDir}/preview-test-script-src-relative.html`
  const scriptPath = `${tmpDir}/preview-test-script-src-relative.js`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Script Src Relative Test</title>
</head>
<body>
  <div id="status">before</div>
  <script src="./preview-test-script-src-relative.js"></script>
</body>
</html>`

  const script = `const statusNode = document.getElementById('status')
if (statusNode) {
  statusNode.textContent = 'after external script'
  statusNode.setAttribute('data-script-loaded', 'yes')
}`

  await FileSystem.writeFile(scriptPath, script)
  await FileSystem.writeFile(htmlPath, html)
  await Main.openUri(htmlPath)

  await Command.execute('Layout.showPreview', htmlPath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const status = previewArea.locator('#status')
  await expect(status).toBeVisible()
  await expect(status).toContainText('after external script')
  await expect(status).toHaveAttribute('data-script-loaded', 'yes')
}
