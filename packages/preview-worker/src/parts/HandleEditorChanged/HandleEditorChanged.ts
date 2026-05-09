import { EditorWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import { hasMatchingLinkedStyleSheet } from '../HasMatchingLinkedStyleSheet/HasMatchingLinkedStyleSheet.ts'
import * as IsTsxUri from '../IsTsxUri/IsTsxUri.ts'
import * as LoadScriptTags from '../LoadScriptTags/LoadScriptTags.ts'
import * as LoadStyleSheets from '../LoadStyleSheets/LoadStyleSheets.ts'
import { loadStyleSheetsWithEditorOverride } from '../LoadStyleSheetsWithEditorOverride/LoadStyleSheetsWithEditorOverride.ts'
import * as LoadTsx from '../LoadTsx/LoadTsx.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'
import * as PreviewStates from '../PreviewStates/PreviewStates.ts'

const createErrorState = (state: PreviewState, error: unknown): PreviewState => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  return {
    ...state,
    content: '',
    css: [],
    errorMessage,
    parsedDom: [],
    scripts: [],
    styleSheets: [],
  }
}

const createPartialErrorState = (state: PreviewState, error: unknown): PreviewState => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  return {
    ...state,
    errorMessage,
  }
}

const setPreviewState = (previewUid: number, oldState: PreviewState, newState: PreviewState): void => {
  PreviewStates.set(previewUid, oldState, newState)
}

const findMatchingEditorUid = async (editorKeys: readonly string[], uri: string): Promise<number | undefined> => {
  for (const editorKey of editorKeys) {
    const currentEditorUid = Number.parseFloat(editorKey)
    const editorUri = await EditorWorker.invoke('Editor.getUri', currentEditorUid)
    if (editorUri === uri) {
      return currentEditorUid
    }
  }
  return undefined
}

const updatePreviewFromEditorContent = async (previewUid: number, state: PreviewState, content: string): Promise<void> => {
  try {
    const updatedState = await getUpdatedStateFromContent(state, content)
    setPreviewState(previewUid, state, updatedState)
  } catch (error) {
    setPreviewState(previewUid, state, createErrorState(state, error))
  }
}

const updatePreviewFromEditor = async (previewUid: number, state: PreviewState, getContent: () => Promise<string>): Promise<void> => {
  try {
    const content = await getContent()
    await updatePreviewFromEditorContent(previewUid, state, content)
  } catch (error) {
    setPreviewState(previewUid, state, createErrorState(state, error))
  }
}

const updatePreviewFromStylesheetOverride = async (
  previewUid: number,
  state: PreviewState,
  changedEditorUri: string,
  content: string,
): Promise<void> => {
  try {
    const css = await loadStyleSheetsWithEditorOverride(
      state.uri,
      state.styleSheets,
      state.css,
      state.loadExternalStyleSheets,
      state.loadStyleElements,
      changedEditorUri,
      content,
    )
    setPreviewState(previewUid, state, {
      ...state,
      css,
      errorMessage: '',
    })
  } catch (error) {
    setPreviewState(previewUid, state, createPartialErrorState(state, error))
  }
}

const refreshAllPreviews = async (): Promise<void> => {
  const previewKeys = PreviewStates.getKeys()
  const editorKeys = await EditorWorker.invoke('Editor.getKeys')

  for (const previewUid of previewKeys) {
    const { newState: state } = PreviewStates.get(previewUid)
    if (!state.uri) {
      continue
    }
    const matchingEditorUid = await findMatchingEditorUid(editorKeys, state.uri)
    if (matchingEditorUid === undefined) {
      continue
    }
    await updatePreviewFromEditor(previewUid, state, () => EditorWorker.invoke('Editor.getText', matchingEditorUid))
  }

  await RendererWorker.invoke('Preview.rerender')
}

const getUpdatedStateFromContent = async (state: PreviewState, content: string): Promise<PreviewState> => {
  if (IsTsxUri.isTsxUri(state.uri)) {
    return {
      ...state,
      ...(await LoadTsx.loadTsx(state, content)),
    }
  }

  const parseResult = ParseHtml.parseHtml(content, [])
  const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parseResult.dom)
  const css = await LoadStyleSheets.loadStyleSheets(state.uri, parseResult.styleSheets, state.loadExternalStyleSheets, state.loadStyleElements)
  const scripts = state.loadJavaScript ? await LoadScriptTags.loadScriptTags(state.uri, parseResult.scriptTags) : []
  return {
    ...state,
    content,
    css,
    errorMessage: '',
    parsedDom: parseResult.dom,
    parsedNodesChildNodeCount,
    scripts,
    styleSheets: parseResult.styleSheets,
  }
}

export const handleEditorChanged = async (editorUid?: number): Promise<void> => {
  const hasSpecificEditor = Number.isFinite(editorUid)

  if (!hasSpecificEditor) {
    await refreshAllPreviews()
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
    if (!state.uri) {
      continue
    }

    if (changedEditorUri === state.uri) {
      await updatePreviewFromEditor(previewUid, state, getChangedEditorContent)
      didUpdate = true
      continue
    }

    if (!state.loadExternalStyleSheets) {
      continue
    }

    if (!hasMatchingLinkedStyleSheet(state.uri, state.styleSheets, changedEditorUri)) {
      continue
    }

    const content = await getChangedEditorContent()
    await updatePreviewFromStylesheetOverride(previewUid, state, changedEditorUri, content)
    didUpdate = true
  }

  if (didUpdate) {
    await RendererWorker.invoke('Preview.rerender')
  }
}
