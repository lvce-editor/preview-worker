import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as States from '../PreviewStates/PreviewStates.ts'
import { queueRender } from '../QueueRender/QueueRender.ts'

export const render2 = (uid: number, diffResult: readonly number[]): readonly any[] | Promise<readonly any[]> => {
  const pendingDiffs = [...new Set([...diffResult, ...Diff2.diff2(uid)])]
  const { oldState, scheduledState } = States.get(uid)
  const commands = ApplyRender.applyRender(oldState, scheduledState, pendingDiffs)
  return queueRender(uid, commands, oldState, scheduledState)
}
