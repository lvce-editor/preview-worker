import { afterEach, expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleDragStart from '../src/parts/HandleDragStart/HandleDragStart.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'

const createState = (uid: number, overrides: Partial<PreviewState> = {}): PreviewState => ({
  ...createDefaultState(),
  assetDir: '',
  content: '',
  css: [],
  errorCount: 0,
  errorMessage: '',
  initial: false,
  parsedDom: [],
  parsedNodesChildNodeCount: 0,
  platform: 0,
  scripts: [],
  uid,
  uri: '',
  useSandboxWorker: false,
  warningCount: 0,
  ...overrides,
})

const setupHappyDom = (uid: number, html: string, scripts: readonly string[]): void => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = html

  for (const scriptContent of scripts) {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function('window', 'document', 'console', scriptContent)
    fn(window, document, console)
  }

  const elementMap = new Map<string, any>()
  SerializeHappyDom.serialize(document, elementMap)
  HappyDomState.set(uid, { document, elementMap, window })
}

afterEach(() => {
  HappyDomState.remove(1)
})

test('handleDragStart should return state unchanged when hdId is empty', () => {
  const state = createState(1)
  const result = HandleDragStart.handleDragStart(state, '')
  expect(result).toBe(state)
})

test('handleDragStart should return state unchanged when no happy-dom state exists', () => {
  const state = createState(1)
  const result = HandleDragStart.handleDragStart(state, '0')
  expect(result).toBe(state)
})

test('handleDragStart should return state unchanged when element not found in map', () => {
  setupHappyDom(1, '<body><div>hello</div></body>', [])
  const state = createState(1)
  const result = HandleDragStart.handleDragStart(state, '999')
  expect(result).toBe(state)
})

test('handleDragStart should dispatch dragstart and update state', () => {
  const html = '<body><div id="draggable" draggable="true">Drag me</div><div id="status">idle</div></body>'
  const scripts = [
    `
    const draggable = document.getElementById("draggable");
    const status = document.getElementById("status");
    draggable.addEventListener("dragstart", () => {
      status.textContent = "dragging";
    });
    `,
  ]
  setupHappyDom(1, html, scripts)

  const happyDomInstance = HappyDomState.get(1)!
  let draggableHdId = ''
  for (const [hdId, element] of happyDomInstance.elementMap) {
    if (element.id === 'draggable') {
      draggableHdId = hdId
      break
    }
  }
  expect(draggableHdId).not.toBe('')

  const state = createState(1)
  const result = HandleDragStart.handleDragStart(state, draggableHdId)

  expect(result).not.toBe(state)
  const textNode = result.parsedDom.find((n: any) => n.text === 'dragging')
  expect(textNode).toBeDefined()
})
