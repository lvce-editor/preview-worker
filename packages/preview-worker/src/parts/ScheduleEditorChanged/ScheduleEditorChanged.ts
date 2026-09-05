import { handleEditorChanged } from '../HandleEditorChanged/HandleEditorChanged.ts'

const state: { pendingEditors: Set<number | undefined> | undefined } = { pendingEditors: undefined }

const refreshPendingEditors = async (pendingEditors: Set<number | undefined>): Promise<void> => {
  try {
    while (pendingEditors.size > 0) {
      const editorUid = pendingEditors.values().next().value
      pendingEditors.delete(editorUid)
      try {
        await handleEditorChanged(editorUid)
      } catch (error) {
        console.warn('Failed to update preview after editor change:', error)
      }
    }
  } finally {
    state.pendingEditors = undefined
  }
}

export const scheduleEditorChanged = (editorUid?: number): void => {
  const { pendingEditors } = state
  // Read the latest editor content when its turn arrives. Keep at most one
  // pending refresh per editor while serializing access to the preview sandbox.
  const changedEditorUid = Number.isFinite(editorUid) ? editorUid : undefined
  if (pendingEditors) {
    pendingEditors.add(changedEditorUid)
    return
  }
  const newPendingEditors = new Set([changedEditorUid])
  state.pendingEditors = newPendingEditors
  void refreshPendingEditors(newPendingEditors)
}
