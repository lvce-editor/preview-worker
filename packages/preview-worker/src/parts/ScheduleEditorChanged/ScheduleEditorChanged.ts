import { handleEditorChanged } from '../HandleEditorChanged/HandleEditorChanged.ts'

const pendingEditors = new Set<number | undefined>()
let running = false

const refreshPendingEditors = async (): Promise<void> => {
  running = true
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
    running = false
  }
}

export const scheduleEditorChanged = (editorUid?: number): void => {
  // Read the latest editor content when its turn arrives. Keep at most one
  // pending refresh per editor while serializing access to the preview sandbox.
  pendingEditors.add(Number.isFinite(editorUid) ? editorUid : undefined)
  if (!running) {
    void refreshPendingEditors()
  }
}
