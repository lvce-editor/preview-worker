import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import * as ObserveDom from '../src/parts/ObserveDom/ObserveDom.ts'
import * as PreviewStates from '../src/parts/PreviewStates/PreviewStates.ts'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

jest.mock('@lvce-editor/rpc-registry', () => ({
  RendererWorker: {
    invoke: jest.fn(() => Promise.resolve()),
  },
}))

const { RendererWorker } = await import('@lvce-editor/rpc-registry')

afterEach(() => {
  ObserveDom.disconnect(1)
  HappyDomState.remove(1)
  jest.clearAllMocks()
})

const setupHappyDomWithObserver = (uid: number, html: string, scripts: readonly string[] = []): any => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = html

  for (const scriptContent of scripts) {
    const fn = new Function('window', 'document', 'console', scriptContent)
    fn(window, document, console)
  }

  const elementMap = new Map<string, any>()
  SerializeHappyDom.serialize(document, elementMap)
  HappyDomState.set(uid, { document, elementMap, window })

  const state = {
    ...createDefaultState(),
    uid,
  }
  PreviewStates.set(uid, state, state)

  ObserveDom.observe(uid, document, window)

  return { window, document }
}

const waitForMutationObserver = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 50)
  })
}

test('observe should detect childList mutations and trigger rerender', async () => {
  const { document } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  const container = document.getElementById('container')
  const span = document.createElement('span')
  span.textContent = 'dynamic content'
  container.appendChild(span)

  await waitForMutationObserver()

  expect(RendererWorker.invoke).toHaveBeenCalledWith('Preview.rerender', 1)
})

test('observe should detect attribute mutations and trigger rerender', async () => {
  const { document } = setupHappyDomWithObserver(1, '<body><div id="target"></div></body>')

  const target = document.getElementById('target')
  target.setAttribute('class', 'highlighted')

  await waitForMutationObserver()

  expect(RendererWorker.invoke).toHaveBeenCalledWith('Preview.rerender', 1)
})

test('observe should detect characterData mutations and trigger rerender', async () => {
  const { document } = setupHappyDomWithObserver(1, '<body><div id="text">original</div></body>')

  const textDiv = document.getElementById('text')
  textDiv.textContent = 'changed'

  await waitForMutationObserver()

  expect(RendererWorker.invoke).toHaveBeenCalledWith('Preview.rerender', 1)
})

test('observe should update PreviewStates with new parsedDom', async () => {
  const { document } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  const stateBefore = PreviewStates.get(1).newState

  const container = document.getElementById('container')
  const p = document.createElement('p')
  p.textContent = 'new paragraph'
  container.appendChild(p)

  await waitForMutationObserver()

  const stateAfter = PreviewStates.get(1).newState
  expect(stateAfter.parsedDom).not.toBe(stateBefore.parsedDom)
})

test('observe should update HappyDomState elementMap', async () => {
  const { document } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  const elementMapBefore = HappyDomState.get(1)!.elementMap

  const container = document.getElementById('container')
  const span = document.createElement('span')
  container.appendChild(span)

  await waitForMutationObserver()

  const elementMapAfter = HappyDomState.get(1)!.elementMap
  expect(elementMapAfter).not.toBe(elementMapBefore)
})

test('observe should detect mutations from setTimeout in user scripts', async () => {
  const { window } = setupHappyDomWithObserver(
    1,
    '<body><div id="container">initial</div></body>',
    [
      `
      window.setTimeout(() => {
        const el = document.getElementById("container");
        el.textContent = "updated after timeout";
      }, 10);
      `,
    ],
  )

  await new Promise((resolve) => {
    setTimeout(resolve, 100)
  })

  expect(RendererWorker.invoke).toHaveBeenCalledWith('Preview.rerender', 1)
})

test('disconnect should stop observing mutations', async () => {
  const { document } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  ObserveDom.disconnect(1)

  const container = document.getElementById('container')
  const span = document.createElement('span')
  container.appendChild(span)

  await waitForMutationObserver()

  expect(RendererWorker.invoke).not.toHaveBeenCalled()
})

test('observe should replace existing observer for same uid', async () => {
  const { document, window } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  // Observe again (should replace)
  ObserveDom.observe(1, document, window)

  const container = document.getElementById('container')
  const span = document.createElement('span')
  container.appendChild(span)

  await waitForMutationObserver()

  // Should still work, not fire twice
  expect(RendererWorker.invoke).toHaveBeenCalledTimes(1)
})

test('observe should not throw when HappyDomState is missing during mutation', async () => {
  const { document } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  // Remove the happy dom state
  HappyDomState.remove(1)

  const container = document.getElementById('container')
  const span = document.createElement('span')
  container.appendChild(span)

  await waitForMutationObserver()

  // Should not call rerender since there's no happy dom state
  expect(RendererWorker.invoke).not.toHaveBeenCalled()
})
