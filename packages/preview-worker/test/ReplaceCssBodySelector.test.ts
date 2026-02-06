import { describe, it, expect } from 'vitest'
import * as ReplaceCssBodySelector from '../src/parts/ReplaceCssBodySelector/ReplaceCssBodySelector.ts'

describe('ReplaceCssBodySelector', () => {
  it('should replace simple body selector', () => {
    const css = 'body { color: red; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview { color: red; }')
  })

  it('should replace body in combined selectors', () => {
    const css = 'body, div { margin: 0; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview, div { margin: 0; }')
  })

  it('should replace multiple body selectors', () => {
    const css = 'body { color: red; } body p { margin: 10px; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview { color: red; } .Preview p { margin: 10px; }')
  })

  it('should not replace tbody', () => {
    const css = 'tbody { border: 1px solid; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('tbody { border: 1px solid; }')
  })

  it('should not replace body as part of another word', () => {
    const css = 'somebody { color: blue; } anybody-class { display: none; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('somebody { color: blue; } anybody-class { display: none; }')
  })

  it('should handle body with pseudo-classes', () => {
    const css = 'body:hover { background: yellow; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview:hover { background: yellow; }')
  })

  it('should handle body with pseudo-elements', () => {
    const css = 'body::before { content: ""; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview::before { content: ""; }')
  })

  it('should handle body with descendant selectors', () => {
    const css = 'body > * { box-sizing: border-box; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview > * { box-sizing: border-box; }')
  })

  it('should handle empty CSS string', () => {
    const css = ''
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('')
  })

  it('should handle CSS without body selector', () => {
    const css = 'div { color: green; } p { margin: 5px; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('div { color: green; } p { margin: 5px; }')
  })

  it('should handle body with newlines', () => {
    const css = `body {
  color: red;
  background: white;
}`
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe(`.Preview {
  color: red;
  background: white;
}`)
  })

  it('should handle multiple body selectors in different contexts', () => {
    const css = 'body { font-size: 16px; } .container body { display: flex; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview { font-size: 16px; } .container .Preview { display: flex; }')
  })
})
