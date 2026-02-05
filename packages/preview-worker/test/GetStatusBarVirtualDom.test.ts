import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as GetStatusBarVirtualDom from '../src/parts/GetPreviewDom/GetPreviewDom.ts'

test('getPreviewDom should return an array', () => {
  const result = GetStatusBarVirtualDom.getPreviewDom()
  expect(Array.isArray(result)).toBe(true)
})

test('getPreviewDom should return 3 elements', () => {
  const result = GetStatusBarVirtualDom.getPreviewDom()
  expect(result).toHaveLength(3)
})

test('getPreviewDom should return Div wrapper as first item', () => {
  const result = GetStatusBarVirtualDom.getPreviewDom()
  const firstElement = result[0]
  expect(firstElement.type).toBe(VirtualDomElements.Div)
  expect(firstElement.className).toBe('Viewlet Preview')
  expect(firstElement.childCount).toBe(1)
})

test('getPreviewDom should return H1 element as second item', () => {
  const result = GetStatusBarVirtualDom.getPreviewDom()
  const secondElement = result[1]
  expect(secondElement.type).toBe(VirtualDomElements.H1)
  expect(secondElement.childCount).toBe(1)
})

test('getPreviewDom should return Text element as third item', () => {
  const result = GetStatusBarVirtualDom.getPreviewDom()
  const thirdElement = result[2]
  expect(thirdElement.type).toBe(VirtualDomElements.Text)
  expect(thirdElement.text).toBe('hello from preview')
})

test('getPreviewDom should return consistent results', () => {
  const result1 = GetStatusBarVirtualDom.getPreviewDom()
  const result2 = GetStatusBarVirtualDom.getPreviewDom()
  expect(result1).toEqual(result2)
})
