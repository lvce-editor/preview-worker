import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.keyup-event'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-keyup.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Keyup Event Test</title>
</head>
<body>
  <input type="text" id="textInput" placeholder="Type here">
  <p id="output">No key released</p>

  <script>
    document.getElementById('textInput').addEventListener('keyup', function(event) {
      const key = event.key || event.code
      document.getElementById('output').textContent = 'Key released: ' + key
    })
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const input = previewArea.locator('#textInput')
  const output = previewArea.locator('#output')
  await expect(input).toBeVisible()
  await expect(output).toBeVisible()
  await expect(output).toHaveText('No key released')

  const mutationPromise = Command.execute('Preview.waitForMutation')

  await Command.execute('Preview.handleKeyUp', '0', 'a', 'KeyA')

  await mutationPromise
  await expect(output).toHaveText('Key released: a')
}
