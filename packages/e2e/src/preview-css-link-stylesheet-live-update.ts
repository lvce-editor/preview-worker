import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-link-stylesheet-live-update'

const waitForCss = async (expect: any, locator: any, property: string, value: string): Promise<void> => {
  let lastError: unknown
  for (let i = 0; i < 40; i++) {
    try {
      await expect(locator).toHaveCSS(property, value)
      return
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  throw lastError
}

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const cssFileName = `preview-test-css-link-stylesheet-live-update-${uniqueId}.css`
  const targetId = `target-${uniqueId}`
  const filePath = `${tmpDir}/preview-test-css-link-stylesheet-live-update-${uniqueId}.html`
  const cssPath = `${tmpDir}/${cssFileName}`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>CSS Link Live Update Test</title>
  <link rel="stylesheet" href="./${cssFileName}">
</head>
<body>
  <div id="${targetId}">Styled via linked stylesheet</div>
</body>
</html>`

  const initialCss = `#${targetId} {
  color: rgb(255, 0, 0);
}`

  const updatedCss = `#${targetId} {
  color: rgb(0, 0, 255);
}`

  await FileSystem.setFiles([
    { content: initialCss, uri: cssPath },
    { content: html, uri: filePath },
  ])
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator(`#${targetId}`)
  await expect(target).toBeVisible()

  await Main.openUri(cssPath)

  // act
  await Editor.setText(updatedCss)

  // assert
  await waitForCss(expect, target, 'color', 'rgb(0, 0, 255)')
}
