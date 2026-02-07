import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-basic'

export const test: Test = async ({ Command, expect, FileSystem, Locator }) => {
  // Create a temporary HTML file with canvas element
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}preview-test-canvas-${Date.now()}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Canvas Basic Test</title>
  <style>
    canvas {
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <h2>Canvas Drawing Test</h2>
  <canvas id="myCanvas" width="200" height="200"></canvas>

  <script>
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // Draw a simple rectangle
    ctx.fillStyle = 'blue';
    ctx.fillRect(50, 50, 100, 100);

    // Draw a circle
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(150, 150, 30, 0, Math.PI * 2);
    ctx.fill();
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

  // Verify the heading is visible
  const heading = previewArea.locator('h2')
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('Canvas Drawing Test')

  // Verify the canvas element is present and visible
  const canvas = previewArea.locator('canvas#myCanvas')
  await expect(canvas).toBeVisible()
  await expect(canvas).toHaveAttribute('width', '200')
  await expect(canvas).toHaveAttribute('height', '200')
}
