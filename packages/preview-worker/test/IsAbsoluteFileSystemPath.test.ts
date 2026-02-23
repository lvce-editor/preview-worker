import { expect, test } from '@jest/globals'
import * as IsAbsolute from '../src/parts/LoadStyleSheets/IsAbsoluteFileSystemPath/IsAbsoluteFileSystemPath.ts'

test('isAbsoluteFileSystemPath should detect POSIX absolute path', () => {
  expect(IsAbsolute.isAbsoluteFileSystemPath('/tmp/app.css')).toBe(true)
})

test('isAbsoluteFileSystemPath should detect Windows absolute path', () => {
  expect(IsAbsolute.isAbsoluteFileSystemPath('C:\\temp\\app.css')).toBe(true)
})

test('isAbsoluteFileSystemPath should detect UNC path', () => {
  expect(IsAbsolute.isAbsoluteFileSystemPath('\\\\server\\share')).toBe(true)
})

test('isAbsoluteFileSystemPath should return false for relative path', () => {
  expect(IsAbsolute.isAbsoluteFileSystemPath('./app.css')).toBe(false)
})
