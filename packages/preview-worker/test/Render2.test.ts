import { expect, test } from '@jest/globals'
import { render2 } from '../src/parts/Render2/Render2.ts'

test('render2 should ignore a preview that was disposed before rendering', () => {
  expect(render2(1004, [])).toEqual([])
})
