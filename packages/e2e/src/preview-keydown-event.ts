import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.keydown-event'

export const test: Test = async ({ Command, expect, FileSystem, Locator }) => {
  // Create a temporary HTML file with keydown event handler
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}preview-test-keydown-${Date.now()}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Keydown Event Test</title>
</head>
<body>
  <input type="text" id="textInput" placeholder="Type here">
  <p id="output">No key pressed</p>

  <script>
    document.getElementById('textInput').addEventListener('keydown', function(event) {
      const key = event.key || event.code;
      document.getElementById('output').textContent = 'Key pressed: ' + key;
    });
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  const uri = filePath.replaceAll(/^\//g, 'file:///')

  // Open the preview with the HTML file
  await Command.execute('Layout.showPreview', uri)

  // Wait for preview to render
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  // Find the input field and output paragraph
  const input = previewArea.locator('#textInput')
  const output = previewArea.locator('#output')

  await expect(input).toBeVisible()
  await expect(output).toBeVisible()
  await expect(output).toContainText('No key pressed')

  // Type 'a' in the input field
  await input.type('a')

  // Verify output has been updated with the key press
  await expect(output).toContainText('Key pressed:')
}
