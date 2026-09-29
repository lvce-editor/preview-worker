import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.inner-width'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-inner-width.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>InnerWidth and InnerHeight Test</title>
</head>
<body>
  <h1>Window Dimensions</h1>
  <output id="dimensions"></output>

  <script>
    const dimensions = document.getElementById('dimensions');
    const readDimensions = () => [
        innerWidth,
        innerHeight,
        window.innerWidth,
        window.innerHeight,
        globalThis.innerWidth,
        globalThis.innerHeight,
      ];
    let previousDimensions;
    const updateDimensions = () => {
      const currentDimensions = readDimensions();
      const valid =
        currentDimensions.every(Number.isFinite) &&
        currentDimensions[0] > 0 &&
        currentDimensions[1] > 0 &&
        currentDimensions[0] === currentDimensions[2] &&
        currentDimensions[0] === currentDimensions[4] &&
        currentDimensions[1] === currentDimensions[3] &&
        currentDimensions[1] === currentDimensions[5];
      const widthChanged = previousDimensions && currentDimensions[0] !== previousDimensions[0];
      const heightChanged = previousDimensions && currentDimensions[1] !== previousDimensions[1];
      dimensions.textContent = !valid ? 'invalid' : !previousDimensions ? 'valid-initial' : widthChanged ? 'valid-width-updated' : heightChanged ? 'valid-height-updated' : 'valid-unchanged';
      previousDimensions = currentDimensions;
    };
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  // act
  await Command.execute('Layout.showPreview', filePath)

  // assert
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const dimensions = previewArea.locator('#dimensions')
  await expect(dimensions).toBeVisible()

  await expect(dimensions).toHaveText('valid-initial')
  await Command.execute('Layout.handleSashPointerDown', 'Preview')
  await Command.execute('Layout.handleSashPointerMove', 700, 300)
  await Command.execute('Layout.handleSashPointerUp', 'Preview')
  await expect(dimensions).toHaveText('valid-width-updated')

  await Command.execute('Layout.handleSashPointerDown', 'Preview')
  await Command.execute('Layout.handleSashPointerMove', 640, 300)
  await Command.execute('Layout.handleSashPointerUp', 'Preview')
  await expect(dimensions).toHaveText('valid-width-updated')

  await Command.execute('Layout.setExplicitBounds', 1280, 760)
  await expect(dimensions).toHaveText('valid-height-updated')

  await Command.execute('Layout.showPreview', filePath)
  await expect(dimensions).toHaveText('valid-initial')
}
