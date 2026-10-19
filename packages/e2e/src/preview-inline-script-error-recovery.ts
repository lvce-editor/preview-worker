import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.inline-script-error-recovery'

const createHtml = (script: string): string => `<!doctype html>
<html><head><title>Document</title></head><body>
<input id="color"/><output id="status">ready</output>
<script type="module">${script}</script>
</body></html>`

const script = `const input = document.querySelector('input')
console.log(input)
input.oninput = event => { document.getElementById('status').textContent = event.target.value }
input.onchange = event => {
  document.getElementById('status').textContent = 'changed'
  document.body.style.background = event.target.value
}`

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-inline-script.html`
  await FileSystem.writeFile(filePath, createHtml(script))
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)
  const status = Locator('.Viewlet.Preview #status')
  await expect(status).toHaveText('ready')

  await Editor.setText(createHtml('const input ='))
  let hasSyntaxError = false
  for (let i = 0; i < 40; i++) {
    const diagnostics = await Command.execute('Preview.getRuntimeDiagnostics')
    if (diagnostics.errorCount > 0) {
      hasSyntaxError = true
      break
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  if (!hasSyntaxError) {
    throw new Error('Preview did not report the temporary script syntax error')
  }

  // Rapid partial edits and recovery must preserve interactive scripts.
  for (let length = 1; length < 35; length++) {
    await Editor.setText(createHtml(script.slice(0, length)))
  }
  await Editor.setText(createHtml(script))
  const input = Locator('.Viewlet.Preview #color')
  await expect(input).toBeVisible()
  await input.type('green')
  await expect(status).toHaveText('green')
  await input.dispatchEvent('change', { bubbles: true } as unknown as string)
  await expect(status).toHaveText('changed')
  await expect(Locator('.Viewlet.Preview .Body')).toHaveCSS('background-color', 'rgb(0, 128, 0)')

  // Close while an editor update may still be pending, then reopen saved content.
  await Editor.setText(createHtml('const input ='))
  await Command.execute('Layout.hidePreview')
  await Command.execute('Layout.showPreview', filePath)
  await expect(Locator('.Viewlet.Preview #color')).toBeVisible()
  await Locator('.Viewlet.Preview #color').type('blue')
  await expect(status).toHaveText('blue')
}
