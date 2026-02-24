import { EditorWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadStyleSheets from '../LoadStyleSheets/LoadStyleSheets.ts'
import { hasMatchingLinkedStyleSheet, loadStyleSheetsWithEditorOverride } from '../LoadStyleSheetsWithEditorOverride/LoadStyleSheetsWithEditorOverride.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'
import * as PreviewStates from '../PreviewStates/PreviewStates.ts'

export const handleEditorChanged = async (editorUid?: number): Promise<void> => {
  const hasSpecificEditor = Number.isFinite(editorUid)

  if (!hasSpecificEditor) {
    // Get all preview instance keys
    const previewKeys = PreviewStates.getKeys()

    // Get all editor keys from the editor worker
    const editorKeys = await EditorWorker.invoke('Editor.getKeys')

    // For each preview instance
    for (const previewUid of previewKeys) {
      const { newState: state } = PreviewStates.get(previewUid)

      // Skip if no URI is set
      if (!state.uri) {
        continue
      }

      // Find the editor that matches our preview's URI
      let matchingEditorUid: any = null
      for (const editorKey of editorKeys) {
        const currentEditorUid = Number.parseFloat(editorKey)
        const editorUri = await EditorWorker.invoke('Editor.getUri', currentEditorUid)
        if (editorUri === state.uri) {
          matchingEditorUid = currentEditorUid
          break
        }
      }

      // If we found a matching editor, get its text and update the preview
      if (matchingEditorUid !== null) {
        try {
          const content = await EditorWorker.invoke('Editor.getText', matchingEditorUid)
          const parseResult = ParseHtml.parseHtml(content, [])
          const css = await LoadStyleSheets.loadStyleSheets(
            state.uri,
            parseResult.styleSheets,
            state.loadExternalStyleSheets,
            state.loadStyleElements,
          )
          const scripts = state.loadJavaScript ? parseResult.scripts : []

          const updatedState = {
            ...state,
            content,
            css,
            errorMessage: '',
            parsedDom: parseResult.dom,
            scripts,
          }

          PreviewStates.set(previewUid, state, updatedState)
        } catch (error) {
          // If getting text fails, update with error message
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          const updatedState = {
            ...state,
            content: '',
            css: [],
            errorMessage,
            parsedDom: [],
            scripts: [],
          }

          PreviewStates.set(previewUid, state, updatedState)
        }
      }
    }

    // Rerender all previews after updates are complete
    await RendererWorker.invoke('Preview.rerender')
    return
  }

  const changedEditorUid = editorUid as number
  const changedEditorUri = await EditorWorker.invoke('Editor.getUri', changedEditorUid)
  const previewKeys = PreviewStates.getKeys()
  let changedEditorContent: string | undefined
  const getChangedEditorContent = async (): Promise<string> => {
    const cachedContent = changedEditorContent
    if (cachedContent !== undefined) {
      return cachedContent
    }
    const content = await EditorWorker.invoke('Editor.getText', changedEditorUid)
    changedEditorContent = content
    return content
  }
  let didUpdate = false

  // Get all preview instance keys
  for (const previewUid of previewKeys) {
    const { newState: state } = PreviewStates.get(previewUid)

    // Skip if no URI is set
    if (!state.uri) {
      continue
    }

    if (changedEditorUri === state.uri) {
      try {
        const content = await getChangedEditorContent()
        const parseResult = ParseHtml.parseHtml(content, [])
        const css = await LoadStyleSheets.loadStyleSheets(state.uri, parseResult.styleSheets, state.loadExternalStyleSheets, state.loadStyleElements)
        const scripts = state.loadJavaScript ? parseResult.scripts : []

        const updatedState = {
          ...state,
          content,
          css,
          errorMessage: '',
          parsedDom: parseResult.dom,
          scripts,
        }

        PreviewStates.set(previewUid, state, updatedState)
        didUpdate = true
      } catch (error) {
        // If getting text fails, update with error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const updatedState = {
          ...state,
          content: '',
          css: [],
          errorMessage,
          parsedDom: [],
          scripts: [],
        }

        PreviewStates.set(previewUid, state, updatedState)
        didUpdate = true
      }
      continue
    }

    if (!state.content || !state.loadExternalStyleSheets) {
      continue
    }

    const parseResult = ParseHtml.parseHtml(state.content, [])
    if (!hasMatchingLinkedStyleSheet(state.uri, parseResult.styleSheets, changedEditorUri)) {
      continue
    }

    try {
      const content = await getChangedEditorContent()
      const css = await loadStyleSheetsWithEditorOverride(
        state.uri,
        parseResult.styleSheets,
        state.loadExternalStyleSheets,
        state.loadStyleElements,
        changedEditorUri,
        content,
      )
      const updatedState = {
        ...state,
        css,
        errorMessage: '',
      }
      PreviewStates.set(previewUid, state, updatedState)
      didUpdate = true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const updatedState = {
        ...state,
        errorMessage,
      }
      PreviewStates.set(previewUid, state, updatedState)
      didUpdate = true
    }
  }

  if (didUpdate) {
    await RendererWorker.invoke('Preview.rerender')
  }
}
