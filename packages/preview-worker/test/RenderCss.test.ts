import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderCss } from '../src/parts/RenderCss/RenderCss.ts'

test('renderCss resolves viewport units against the preview container', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    css: ['canvas { display: block; width: 100vw; height: 100vh; }'],
    uid: 7,
  }

  expect(renderCss(oldState, newState)).toEqual([
    'Viewlet.setCss',
    7,
    '.Preview { container-type: size; }\n.Preview canvas {  display: block; width: 100cqw; height: 100cqh;  }',
  ])
})

test('renderCss preserves viewport-like text in strings and comments', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    css: ['.label::before { content: "100vw"; /* 100vh */ width: 50vw; }'],
    uid: 8,
  }

  expect(renderCss(oldState, newState)).toEqual([
    'Viewlet.setCss',
    8,
    '.Preview { container-type: size; }\n.Preview .label::before {  content: "100vw"; /* 100vh */ width: 50cqw;  }',
  ])
})
