/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { PreviewState } from '../PreviewState/PreviewState.ts'

const states = new Map<number, { newState: PreviewState; oldState: PreviewState }>()

export const set = (uid: number, newState: PreviewState, oldState: PreviewState): void => {
  states.set(uid, { newState, oldState })
}

export const get = (uid: number): { newState: PreviewState; oldState: PreviewState } => {
  const state = states.get(uid)
  if (!state) {
    throw new Error(`State not found for uid ${uid}`)
  }
  return state
}

export const registerCommands = (commandMap: Record<string, unknown>): void => {
  // Register commands if needed
}

export const getCommandIds = (): readonly string[] => {
  return []
}

export const wrapCommand = (fn: (state: PreviewState, ...args: unknown[]) => unknown) => {
  return (uid: number, ...args: unknown[]) => {
    const { newState } = get(uid)
    return fn(newState, ...args)
  }
}

export const wrapGetter = (fn: (state: PreviewState) => unknown) => {
  return (uid: number) => {
    const { newState } = get(uid)
    return fn(newState)
  }
}
