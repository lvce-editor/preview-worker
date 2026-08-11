import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.color-input-change'

// Requires matching preview-worker and preview-sandbox-worker releases.
export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-color-input-change.html`
  const html = `<!doctype html>
<html lang="en">
<body>
  <h1 id="text" style="color: rgb(0, 0, 0)">Hello World</h1>
  <input id="colorPicker" type="color" value="#ff0000" />
  <script>
    const textEl = document.getElementById('text');
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('change', (event) => {
      textEl.style.color = event.target.value;
    });
  </script>
</body>
</html>`
  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  const text = previewArea.locator('#text')
  const colorPicker = previewArea.locator('#colorPicker')
  await expect(text).toHaveCSS('color', 'rgb(0, 0, 0)')

  await colorPicker.dispatchEvent('change', { bubbles: true } as unknown as string)

  await expect(text).toHaveCSS('color', 'rgb(255, 0, 0)')
}
