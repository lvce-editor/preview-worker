import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-resize'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // Create a temporary HTML file with canvas that resizes itself
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-canvas-resize.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Canvas Resize Test</title>
  <style>
    canvas {
      border: 1px solid #ccc;
      display: block;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <h2>Canvas Resize Test</h2>
  <p>Initial size: 200x200</p>
  <canvas id="resizableCanvas" width="200" height="200"></canvas>
  <button id="resizeBtn">Resize Canvas</button>
  <span id="canvasSize"></span>

  <script>
    const canvas = document.getElementById('resizableCanvas');
    const ctx = canvas.getContext('2d');
    const sizeSpan = document.getElementById('canvasSize');

    function drawAndUpdateSize() {
      // Draw a filled rectangle to verify size
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update size display
      sizeSpan.textContent = canvas.width + 'x' + canvas.height;
    }

    // Initial draw
    drawAndUpdateSize();

    // Resize on button click
    document.getElementById('resizeBtn').addEventListener('click', () => {
      canvas.width = 400;
      canvas.height = 300;
      drawAndUpdateSize();
    });

    // Also test programmatic resize
    setTimeout(() => {
      canvas.width = 300;
      canvas.height = 250;
      drawAndUpdateSize();
    }, 1000);
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)

  // Open the preview with the HTML file
  await Command.execute('Layout.showPreview', filePath)

  // Wait for preview to render
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  // Verify the heading is visible
  const heading = previewArea.locator('h2')
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('Canvas Resize Test')

  // Verify the canvas element is present and visible with initial size
  const canvas = previewArea.locator('canvas')
  await expect(canvas).toBeVisible()
  await expect(canvas).toHaveAttribute('width', '200')
  await expect(canvas).toHaveAttribute('height', '200')

  // Verify initial size is displayed
  const sizeSpan = previewArea.locator('#canvasSize')
  await expect(sizeSpan).toContainText('200x200')

  // Click the resize button
  const resizeBtn = previewArea.locator('#resizeBtn')
  await resizeBtn.click()

  // Wait for canvas to be resized and check the new size
  // The canvas should now be 400x300
  await expect(canvas).toHaveAttribute('width', '400')
  await expect(canvas).toHaveAttribute('height', '300')
  await expect(sizeSpan).toContainText('400x300')

  // Wait for programmatic resize (1 second after initial load + some buffer)
  // The canvas should be resized to 300x250
  await expect(canvas).toHaveAttribute('width', '300')
  await expect(canvas).toHaveAttribute('height', '250')
  await expect(sizeSpan).toContainText('300x250')
}
