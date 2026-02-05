import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const resize = (state: StatusBarState, dimensions: any): StatusBarState => {
  return {
    ...state,
    ...dimensions,
  }
}
