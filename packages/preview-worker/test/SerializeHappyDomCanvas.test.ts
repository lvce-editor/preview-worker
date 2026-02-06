import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/constants'
import { Window } from 'happy-dom-without-node'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'

test('serialize should serialize canvas element with Canvas type', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const elementMap = new Map<string, any>()
  const result = SerializeHappyDom.serialize(document, elementMap)
  const canvasNode = result.dom.find((node: any) => node.type === VirtualDomElements.Canvas)
  expect(canvasNode).toBeDefined()
  expect((canvasNode as any).width).toBe('320')
  expect((canvasNode as any).height).toBe('480')
  expect((canvasNode as any).id).toBe('game')
})

test('serialize should assign data-id to canvas element for event tracking', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const elementMap = new Map<string, any>()
  const result = SerializeHappyDom.serialize(document, elementMap)
  const canvasNode = result.dom.find((node: any) => node.type === VirtualDomElements.Canvas)
  expect((canvasNode as any)['data-id']).toBeDefined()
  expect(elementMap.size).toBeGreaterThan(0)
})
