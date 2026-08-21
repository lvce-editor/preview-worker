import { EditorWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import { hasMatchingLinkedScript } from '../HasMatchingLinkedScript/HasMatchingLinkedScript.ts'
import { hasMatchingLinkedStyleSheet } from '../HasMatchingLinkedStyleSheet/HasMatchingLinkedStyleSheet.ts'
import * as IsTsxUri from '../IsTsxUri/IsTsxUri.ts'
import * as LoadScripts from '../LoadScripts/LoadScripts.ts'
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

const setPreviewState = (previewUid: number, oldState: PreviewState, newState: PreviewState): boolean => {
  if (!PreviewStates.getKeys().includes(previewUid)) {
    return false
  }
  PreviewStates.set(previewUid, oldState, newState)
  return true
}

const findMatchingEditorUid = async (editorKeys: readonly string[], uri: string): Promise<number | undefined> => {
  for (const editorKey of editorKeys) {
    const currentEditorUid = Number(editorKey)
    const editorUri = await EditorWorker.invoke('Editor.getUri', currentEditorUid)
    if (editorUri === uri) {
      return currentEditorUid
    }
  }
  return undefined
}

const updatePreviewFromEditorContent = async (
  previewUid: number,
  state: PreviewState,
  content: string,
  scriptEditorOverride?: ScriptEditorOverride,
): Promise<boolean> => {
  try {
    const updatedState = await getUpdatedStateFromContent(state, content, scriptEditorOverride)
    return setPreviewState(previewUid, state, updatedState)
  } catch (error) {
    return setPreviewState(previewUid, state, createErrorState(state, error))
  }
}

const updatePreviewFromEditor = async (previewUid: number, state: PreviewState, getContent: () => Promise<string>): Promise<boolean> => {
  try {
    const content = await getContent()
    return updatePreviewFromEditorContent(previewUid, state, content)
  } catch (error) {
    return setPreviewState(previewUid, state, createErrorState(state, error))
  }
}

const updatePreviewFromStylesheetOverride = async (
  previewUid: number,
  state: PreviewState,
  changedEditorUri: string,
  content: string,
): Promise<boolean> => {
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
    return setPreviewState(previewUid, state, {
      ...state,
      css,
      errorMessage: '',
    })
  } catch (error) {
    return setPreviewState(previewUid, state, createPartialErrorState(state, error))
  }
}

const refreshAllPreviews = async (): Promise<void> => {
  const previewKeys = PreviewStates.getKeys()
  if (previewKeys.length === 0) {
    return
  }
  const editorKeys = await EditorWorker.invoke('Editor.getKeys')
  let didUpdate = false

  for (const previewUid of previewKeys) {
    if (!PreviewStates.getKeys().includes(previewUid)) {
      continue
    }
    const { newState: state } = PreviewStates.get(previewUid)
    if (!state.uri) {
      continue
    }
    const matchingEditorUid = await findMatchingEditorUid(editorKeys, state.uri)
    if (matchingEditorUid === undefined) {
      continue
    }
    if (await updatePreviewFromEditor(previewUid, state, () => EditorWorker.invoke('Editor.getText', matchingEditorUid))) {
      didUpdate = true
    }
  }

  if (didUpdate) {
    await RendererWorker.invoke('Preview.rerender')
  }
}

interface ScriptEditorOverride {
  readonly content: string
  readonly uri: string
}

const getUpdatedStateFromContent = async (
  state: PreviewState,
  content: string,
  scriptEditorOverride?: ScriptEditorOverride,
): Promise<PreviewState> => {
  if (IsTsxUri.isTsxUri(state.uri)) {
    return {
      ...state,
      ...(await LoadTsx.loadTsx(state, content)),
    }
  }

  const parseResult = ParseHtml.parseHtml(content, [])
  const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parseResult.dom)
  const css = await LoadStyleSheets.loadStyleSheets(state.uri, parseResult.styleSheets, state.loadExternalStyleSheets, state.loadStyleElements)
  const scripts = state.loadJavaScript ? await LoadScriptTags.loadScriptTags(state.uri, parseResult.scriptTags, scriptEditorOverride) : []
  const updatedState = {
    ...state,
    content,
    css,
    errorMessage: '',
    parsedDom: parseResult.dom,
    parsedNodesChildNodeCount,
    scripts,
    styleSheets: parseResult.styleSheets,
  }
  if (scripts.length > 0) {
    return LoadScripts.loadScripts(updatedState, content, css, scripts)
  }
  return updatedState
}

const updatePreviewForChangedEditor = async (
  previewUid: number,
  state: PreviewState,
  changedEditorUri: string,
  getChangedEditorContent: () => Promise<string>,
): Promise<boolean> => {
  if (!state.uri) {
    return false
  }
  if (changedEditorUri === state.uri) {
    return updatePreviewFromEditor(previewUid, state, getChangedEditorContent)
  }
  if (state.loadExternalStyleSheets && hasMatchingLinkedStyleSheet(state.uri, state.styleSheets, changedEditorUri)) {
    const content = await getChangedEditorContent()
    return updatePreviewFromStylesheetOverride(previewUid, state, changedEditorUri, content)
  }
  if (state.loadJavaScript) {
    const { scriptTags } = ParseHtml.parseHtml(state.content, [])
    if (hasMatchingLinkedScript(state.uri, scriptTags, changedEditorUri)) {
      const content = await getChangedEditorContent()
      return updatePreviewFromEditorContent(previewUid, state, state.content, {
        content,
        uri: changedEditorUri,
      })
    }
  }
  return false
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
    if (!PreviewStates.getKeys().includes(previewUid)) {
      continue
    }
    const { newState: state } = PreviewStates.get(previewUid)
    if (await updatePreviewForChangedEditor(previewUid, state, changedEditorUri, getChangedEditorContent)) {
      didUpdate = true
    }
  }

  if (didUpdate) {
    await RendererWorker.invoke('Preview.rerender')
  }
}
