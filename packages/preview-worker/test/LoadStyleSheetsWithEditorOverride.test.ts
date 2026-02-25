import { expect, test } from '@jest/globals'
import * as LoadStyleSheetsWithEditorOverride from '../src/parts/LoadStyleSheetsWithEditorOverride/LoadStyleSheetsWithEditorOverride.ts'

test('loadStyleSheetsWithEditorOverride should use current css for style elements and fallback to style content', async () => {
  const result = await LoadStyleSheetsWithEditorOverride.loadStyleSheetsWithEditorOverride(
    '/tmp/index.html',
    [
      { content: '#a { color: red; }', type: 'style' },
      { content: '#b { color: blue; }', type: 'style' },
    ],
    ['#a { color: green; }'],
    true,
    true,
    '/tmp/other.css',
    '',
  )

  expect(result).toEqual(['#a { color: green; }', '#b { color: blue; }'])
})

test('loadStyleSheetsWithEditorOverride should skip link entries without href', async () => {
  const result = await LoadStyleSheetsWithEditorOverride.loadStyleSheetsWithEditorOverride(
    '/tmp/index.html',
    [{ type: 'link' } as any],
    ['body { color: red; }'],
    true,
    true,
    '/tmp/other.css',
    '',
  )

  expect(result).toEqual([])
})

test('loadStyleSheetsWithEditorOverride should skip unresolved stylesheet uris', async () => {
  const result = await LoadStyleSheetsWithEditorOverride.loadStyleSheetsWithEditorOverride(
    '/tmp/index.html',
    [{ href: '#hash-only', type: 'link' }],
    ['body { color: red; }'],
    true,
    true,
    '/tmp/other.css',
    '',
  )

  expect(result).toEqual([])
})

test('loadStyleSheetsWithEditorOverride should keep existing css for non-overridden linked stylesheets', async () => {
  const result = await LoadStyleSheetsWithEditorOverride.loadStyleSheetsWithEditorOverride(
    '/tmp/index.html',
    [{ href: './app.css', type: 'link' }],
    ['#cached { display: block; }'],
    true,
    true,
    '/tmp/other.css',
    '#override { color: purple; }',
  )

  expect(result).toEqual(['#cached { display: block; }'])
})
