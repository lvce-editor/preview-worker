import { afterEach, expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import * as HandleMousemove from '../src/parts/HandleMousemove/HandleMousemove.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'

const createState = (uid: number, overrides: Partial<PreviewState> = {}): PreviewState => ({
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
  warningCount: 0,
  ...overrides,
})

const setupHappyDom = (uid: number, html: string, scripts: readonly string[] = []): void => {
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

test('handleMousemove should return state unchanged when hdId is empty', () => {
  const state = createState(1)
  const result = HandleMousemove.handleMousemove(state, '', 100, 200)
  expect(result).toBe(state)
})

test('handleMousemove should return state unchanged when no happy-dom state exists', () => {
  const state = createState(1)
  const result = HandleMousemove.handleMousemove(state, '0', 100, 200)
  expect(result).toBe(state)
})

test('handleMousemove should return state unchanged when element not found in map', () => {
  setupHappyDom(1, '<body><div>hello</div></body>')
  const state = createState(1)
  const result = HandleMousemove.handleMousemove(state, '999', 100, 200)
  expect(result).toBe(state)
})

test('handleMousemove should dispatch mousemove and update state', () => {
  const html = '<body><div id="area">Hover area</div></body>'
  const scripts = [
    `
    const area = document.getElementById("area");
    let positionText = "Original";
    area.addEventListener("mousemove", (event) => {
      positionText = 'X:' + event.clientX + ' Y:' + event.clientY;
      area.textContent = positionText;
    });
    `,
  ]
  setupHappyDom(1, html, scripts)

  const happyDomInstance = HappyDomState.get(1)!
  let areaHdId = ''
  for (const [hdId, element] of happyDomInstance.elementMap) {
    if (element.id === 'area') {
      areaHdId = hdId
      break
    }
  }
  expect(areaHdId).not.toBe('')

  const state = createState(1)
  const result = HandleMousemove.handleMousemove(state, areaHdId, 150, 250)

  // parsedDom should have changed
  expect(result).not.toBe(state)
  expect(result.parsedDom).not.toBe(state.parsedDom)

  // Find the text node with the position
  const textNode = result.parsedDom.find((n) => n.text && n.text.includes('X:'))
  expect(textNode).toBeDefined()
  expect(textNode?.text).toContain('X:150')
  expect(textNode?.text).toContain('Y:250')
})

test('handleMousemove should handle multiple mousemove events', () => {
  const html = '<body><div id="tracker">Last: -,-</div></body>'
  const scripts = [
    `
    const tracker = document.getElementById("tracker");
    tracker.addEventListener("mousemove", (event) => {
      tracker.textContent = 'Last: ' + event.clientX + ',' + event.clientY;
    });
    `,
  ]
  setupHappyDom(1, html, scripts)

  const happyDomInstance = HappyDomState.get(1)!
  let trackerHdId = ''
  for (const [hdId, element] of happyDomInstance.elementMap) {
    if (element.id === 'tracker') {
      trackerHdId = hdId
      break
    }
  }

  let state = createState(1)

  // First mousemove
  state = HandleMousemove.handleMousemove(state, trackerHdId, 100, 100)
  let instance = HappyDomState.get(1)!
  for (const [hdId, element] of instance.elementMap) {
    if (element.id === 'tracker') {
      trackerHdId = hdId
      break
    }
  }
  let textNode = state.parsedDom.find((n) => n.text && n.text.includes('100,100'))
  expect(textNode).toBeDefined()

  // Second mousemove
  state = HandleMousemove.handleMousemove(state, trackerHdId, 200, 300)
  instance = HappyDomState.get(1)!
  for (const [hdId, element] of instance.elementMap) {
    if (element.id === 'tracker') {
      trackerHdId = hdId
      break
    }
  }
  textNode = state.parsedDom.find((n) => n.text && n.text.includes('200,300'))
  expect(textNode).toBeDefined()
})
