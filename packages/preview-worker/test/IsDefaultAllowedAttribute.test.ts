import { expect, test } from '@jest/globals'
import { isDefaultAllowedAttribute } from '../src/parts/IsDefaultAllowedAttribute/IsDefaultAllowedAttribute.ts'

// Test data-* attributes
test('should allow data-* attributes', () => {
  expect(isDefaultAllowedAttribute('data-test', [])).toBe(true)
  expect(isDefaultAllowedAttribute('data-value', [])).toBe(true)
  expect(isDefaultAllowedAttribute('data-custom-attr', [])).toBe(true)
})

// Test aria-* attributes
test('should allow aria-* attributes', () => {
  expect(isDefaultAllowedAttribute('aria-label', [])).toBe(true)
  expect(isDefaultAllowedAttribute('aria-hidden', [])).toBe(true)
  // cspell: disable-next-line
  expect(isDefaultAllowedAttribute('aria-describedby', [])).toBe(true)
})

// Test role attribute
test('should allow role attribute', () => {
  expect(isDefaultAllowedAttribute('role', [])).toBe(true)
})

// Test attributes in defaultAllowedAttributes list
test('should allow attributes in defaultAllowedAttributes list', () => {
  const defaultAllowedAttributes = ['id', 'class', 'style']
  expect(isDefaultAllowedAttribute('id', defaultAllowedAttributes)).toBe(true)
  expect(isDefaultAllowedAttribute('class', defaultAllowedAttributes)).toBe(true)
  expect(isDefaultAllowedAttribute('style', defaultAllowedAttributes)).toBe(true)
})

// Test attributes not in list
test('should disallow attributes not in list', () => {
  expect(isDefaultAllowedAttribute('onclick', [])).toBe(false)
  expect(isDefaultAllowedAttribute('onerror', [])).toBe(false)
  expect(isDefaultAllowedAttribute('href', [])).toBe(false)
})

// Test combination: attribute in list and also matches pattern
test('should allow role attribute even with empty defaultAllowedAttributes', () => {
  expect(isDefaultAllowedAttribute('role', [])).toBe(true)
})

// Test edge cases
test('should handle empty attribute name', () => {
  expect(isDefaultAllowedAttribute('', [])).toBe(false)
})

test('should handle empty defaultAllowedAttributes list', () => {
  expect(isDefaultAllowedAttribute('custom', [])).toBe(false)
  expect(isDefaultAllowedAttribute('data-test', [])).toBe(true)
  expect(isDefaultAllowedAttribute('aria-label', [])).toBe(true)
  expect(isDefaultAllowedAttribute('role', [])).toBe(true)
})

// Test case sensitivity
test('should be case sensitive', () => {
  const defaultAllowedAttributes = ['id']
  expect(isDefaultAllowedAttribute('ID', defaultAllowedAttributes)).toBe(false)
  expect(isDefaultAllowedAttribute('Id', defaultAllowedAttributes)).toBe(false)
})

// Test partial matches should not work
test('should not match partial patterns', () => {
  // cspell: disable-next-line
  expect(isDefaultAllowedAttribute('xdata-test', [])).toBe(false)
  expect(isDefaultAllowedAttribute('aria', [])).toBe(false)
  expect(isDefaultAllowedAttribute('roles', [])).toBe(false)
})

// Test with multiple items in defaultAllowedAttributes
test('should check all items in defaultAllowedAttributes', () => {
  const defaultAllowedAttributes = ['id', 'class', 'title', 'alt']
  expect(isDefaultAllowedAttribute('id', defaultAllowedAttributes)).toBe(true)
  expect(isDefaultAllowedAttribute('title', defaultAllowedAttributes)).toBe(true)
  expect(isDefaultAllowedAttribute('alt', defaultAllowedAttributes)).toBe(true)
  expect(isDefaultAllowedAttribute('href', defaultAllowedAttributes)).toBe(false)
})
