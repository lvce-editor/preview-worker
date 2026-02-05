import { expect, test } from '@jest/globals'
import { EventExpression } from '@lvce-editor/constants'
import * as DomEventListenersFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners should return array with HandleClick event listener', () => {
  const result = RenderEventListeners.renderEventListeners()
  expect(result).toEqual([
    {
      name: DomEventListenersFunctions.HandleClick,
      params: ['handleClick', EventExpression.TargetName],
    },
  ])
})
