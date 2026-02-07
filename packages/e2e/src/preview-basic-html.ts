import type { Test } from '@lvce-editor/test-with-playwright'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

export const name = 'preview.basic-html'

export const test: Test = async ({ Command, expect, Locator }) => {
  // Create a temporary HTML file with basic content
  const tmpDir = tmpdir()
  const filePath = join(tmpDir, `preview-test-basic-${Date.now()}.html`)
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Basic HTML Test</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`

  await writeFile(filePath, html)
  const uri = pathToFileURL(filePath).toString()

  // Open the preview with the HTML file
  await Command.execute('Layout.showPreview', uri)

  // Wait for preview to render and verify the h1 element is visible
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  // Check that "Hello World" text is displayed in the preview
  const heading = previewArea.locator('h1')
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('Hello World')
}
