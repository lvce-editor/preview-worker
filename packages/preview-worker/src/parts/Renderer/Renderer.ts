import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export interface Renderer {
  (oldState: StatusBarState, newState: StatusBarState): readonly any[]
}
