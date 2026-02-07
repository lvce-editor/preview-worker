import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = true

export const name = 'preview.mousemove-event'

export const test: Test = async ({ Command, expect, FileSystem, Locator }) => {
  // Create a temporary HTML file with mousemove event handler
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}preview-test-mousemove-${Date.now()}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Mousemove Event Test</title>
</head>
<body>
  <div id="area" style="width: 300px; height: 200px; border: 2px solid black; padding: 10px;">
    Hover here to see coordinates
  </div>
  <p id="output">Coordinates: -,-</p>

  <script>
    document.getElementById('area').addEventListener('mousemove', function(event) {
      document.getElementById('output').textContent = 'Coordinates: ' + event.clientX + ',' + event.clientY;
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

  // Find the area and output paragraph
  const area = previewArea.locator('#area')
  const output = previewArea.locator('#output')

  await expect(area).toBeVisible()
  await expect(output).toBeVisible()
  await expect(output).toContainText('Coordinates: -,-')

  // Move mouse over the area
  await area.hover()

  // Verify output has been updated with the mouse coordinates
  await expect(output).not.toContainText('Coordinates: -,-')
}
