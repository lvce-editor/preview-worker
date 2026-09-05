import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.script-src-live-update'

const createScript = (branches: number): string => {
  return `document.getElementById('status').setAttribute('data-branches', '${branches}')`
}

const waitForAttribute = async (expect: any, locator: any, value: string): Promise<void> => {
  let lastError: unknown
  for (let i = 0; i < 40; i++) {
    try {
      await expect(locator).toHaveAttribute('data-branches', value)
      return
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  throw lastError
}

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const htmlPath = `${tmpDir}/preview-script-src-live-update.html`
  const scriptPath = `${tmpDir}/preview-script-src-live-update.js`
  const html = `<!DOCTYPE html>
<html>
<body>
  <output id="status" data-branches="0">branches</output>
  <script src="./preview-script-src-live-update.js"></script>
</body>
</html>`
  await FileSystem.setFiles([
    { content: html, uri: htmlPath },
    { content: createScript(127), uri: scriptPath },
  ])
  await Main.openUri(htmlPath)
  await Command.execute('Layout.showPreview', htmlPath)

  const status = Locator('.Viewlet.Preview #status')
  await expect(status).toHaveAttribute('data-branches', '127')

  await Main.openUri(scriptPath)
  for (let branches = 128; branches < 148; branches++) {
    await Editor.setText(createScript(branches))
  }
  await Editor.setText(createScript(1023))

  await waitForAttribute(expect, status, '1023')
}
