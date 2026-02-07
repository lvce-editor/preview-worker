import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = true

export const name = 'preview.button-increment'

export const test: Test = async ({ Command, expect, FileSystem, Locator }) => {
  // Create a temporary HTML file with button and click handler
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}preview-test-button-${Date.now()}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Button Increment Test</title>
</head>
<body>
  <p>Count: <span id="count">0</span></p>
  <button id="incrementBtn">Increment</button>

  <script>
    let count = 0;
    document.getElementById('incrementBtn').addEventListener('click', function() {
      count++;
      document.getElementById('count').textContent = count;
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

  // Find and verify initial count is 0
  const countSpan = previewArea.locator('#count')
  await expect(countSpan).toBeVisible()
  await expect(countSpan).toContainText('0')

  // Find and click the button
  const button = previewArea.locator('#incrementBtn')
  await expect(button).toBeVisible()
  await button.click()

  // Verify count incremented to 1
  await expect(countSpan).toContainText('1')

  // Click again and verify count is 2
  await button.click()
  await expect(countSpan).toContainText('2')
}
