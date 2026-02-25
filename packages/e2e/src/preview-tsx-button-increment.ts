import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.tsx-button-increment'

export const skip = 1

const waitForText = async (expect: any, locator: any, value: string): Promise<void> => {
  let lastError: unknown
  for (let i = 0; i < 40; i++) {
    try {
      await expect(locator).toContainText(value)
      return
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  throw lastError
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const filePath = `${tmpDir}/preview-test-tsx-button-${Date.now()}.tsx`
  const tsx = `
export const Component = () => {
  const [count, setCount] = React.useState(0)
  return <button id="tsx-counter" onClick={() => setCount(count + 1)}>Count: {count}</button>
}
`

  await FileSystem.writeFile(filePath, tsx)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const button = previewArea.locator('#tsx-counter')
  await expect(button).toBeVisible()
  await expect(button).toContainText('Count: 0')

  await Command.execute('Preview.handleClick', '0')

  await waitForText(expect, button, 'Count: 1')
}
