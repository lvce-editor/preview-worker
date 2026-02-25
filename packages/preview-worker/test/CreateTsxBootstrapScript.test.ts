import { expect, test } from '@jest/globals'
import { createTsxBootstrapScript } from '../src/parts/LoadTsx/CreateTsxBootstrapScript.ts'

test('createTsxBootstrapScript should define window before loading react-dom client', () => {
  const script = createTsxBootstrapScript('const Component = () => null')
  expect(script).toContain('const globalObject = globalThis')
  expect(script).toContain("Reflect.set(globalObject, 'window', globalObject)")
  expect(script).toContain("Reflect.set(globalObject, 'self', globalObject)")

  const windowShimIndex = script.indexOf("Reflect.set(globalObject, 'window', globalObject)")
  const reactDomImportIndex = script.indexOf("await import('https://esm.sh/react-dom@19/client?dev')")
  expect(windowShimIndex).toBeGreaterThan(-1)
  expect(reactDomImportIndex).toBeGreaterThan(windowShimIndex)
})
