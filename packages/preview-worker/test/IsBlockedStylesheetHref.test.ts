import { expect, test } from '@jest/globals'
import * as IsBlocked from '../src/parts/IsBlockedStylesheetHref/IsBlockedStylesheetHref.ts'

test('isBlockedStylesheetHref should block protocol-relative urls', () => {
  expect(IsBlocked.isBlockedStylesheetHref('//example.com/app.css')).toBe(true)
})

test('isBlockedStylesheetHref should block absolute filesystem paths', () => {
  expect(IsBlocked.isBlockedStylesheetHref('/tmp/app.css')).toBe(true)
})

test('isBlockedStylesheetHref should block data urls', () => {
  expect(IsBlocked.isBlockedStylesheetHref('data:text/css,body{color:red}')).toBe(true)
})

test('isBlockedStylesheetHref should block http and file schemes', () => {
  expect(IsBlocked.isBlockedStylesheetHref('https://example.com/app.css')).toBe(true)
  expect(IsBlocked.isBlockedStylesheetHref('file:///tmp/app.css')).toBe(true)
})

test('isBlockedStylesheetHref should allow relative paths', () => {
  expect(IsBlocked.isBlockedStylesheetHref('./app.css')).toBe(false)
})
