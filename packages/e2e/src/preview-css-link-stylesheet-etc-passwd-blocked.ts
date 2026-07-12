import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.css-link-stylesheet-etc-passwd-blocked'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-css-link-stylesheet-etc-passwd-blocked.html`
  const cssPath = `${tmpDir}/preview-test-css-link-stylesheet-etc-passwd-blocked.css`

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Etc Passwd Stylesheet Blocked Test</title>
  <link rel="stylesheet" href="/etc/passwd">
  <link rel="stylesheet" href="./preview-test-css-link-stylesheet-etc-passwd-blocked.css">
</head>
<body>
  <div id="target">Preview should still render when /etc/passwd is referenced</div>
</body>
</html>`

  const css = `#target {
  color: rgb(0, 0, 255);
}`

  await FileSystem.setFiles([
    { content: css, uri: cssPath },
    { content: html, uri: filePath },
  ])
  await Main.openUri(filePath)

  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const target = previewArea.locator('#target')
  await expect(target).toBeVisible()
  await expect(target).toHaveCSS('color', 'rgb(0, 0, 255)')
}
