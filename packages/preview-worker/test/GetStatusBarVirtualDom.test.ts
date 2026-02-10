import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetStatusBarVirtualDom from '../src/parts/GetPreviewDom/GetPreviewDom.ts'

test('getPreviewDom should return an array', () => {
  const state = createDefaultState()
  const result = GetStatusBarVirtualDom.getPreviewDom(state)
  expect(Array.isArray(result)).toBe(true)
})

test('getPreviewDom should return 4 elements', () => {
  const state = createDefaultState()
  const result = GetStatusBarVirtualDom.getPreviewDom(state)
  expect(result).toHaveLength(4)
})

test('getPreviewDom should return Div wrapper as first item', () => {
  const state = createDefaultState()
  const result = GetStatusBarVirtualDom.getPreviewDom(state)
  const firstElement = result[0]
  expect(firstElement.type).toBe(VirtualDomElements.Div)
  expect(firstElement.className).toBe('Viewlet Preview')
  expect(firstElement.childCount).toBe(1)
})

test('getPreviewDom should return PreviewContents Div as second item', () => {
  const state = createDefaultState()
  const result = GetStatusBarVirtualDom.getPreviewDom(state)
  const secondElement = result[1]
  expect(secondElement.type).toBe(VirtualDomElements.Div)
  expect(secondElement.className).toBe('PreviewContents')
  expect(secondElement.childCount).toBe(1)
})

test('getPreviewDom should return H1 element as third item', () => {
  const state = createDefaultState()
  const result = GetStatusBarVirtualDom.getPreviewDom(state)
  const thirdElement = result[2]
  expect(thirdElement.type).toBe(VirtualDomElements.H1)
  expect(thirdElement.childCount).toBe(1)
})

test('getPreviewDom should return Text element as fourth item with "No URI has been specified" when uri is empty', () => {
  const state = createDefaultState()
  const result = GetStatusBarVirtualDom.getPreviewDom(state)
  const fourthElement = result[3]
  expect(fourthElement.type).toBe(VirtualDomElements.Text)
  expect(fourthElement.text).toBe('No URI has been specified')
})

test('getPreviewDom should return Text element with "Edit the file on the left to get started." when uri is provided', () => {
  const state: PreviewState = { ...createDefaultState(), uri: 'file:///example.html' }
  const result = GetStatusBarVirtualDom.getPreviewDom(state)
  const textElement = result[4]
  expect(textElement.type).toBe(VirtualDomElements.Text)
  expect(textElement.text).toBe('Edit the file on the left to get started.')
})

test('getPreviewDom should return consistent results', () => {
  const state = createDefaultState()
  const result1 = GetStatusBarVirtualDom.getPreviewDom(state)
  const result2 = GetStatusBarVirtualDom.getPreviewDom(state)
  expect(result1).toEqual(result2)
})
