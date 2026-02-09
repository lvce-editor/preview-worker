/* eslint-disable prefer-destructuring */
import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { createWindow } from '../CreateWindow/CreateWindow.ts'
import * as ExecuteScripts from '../ExecuteScripts/ExecuteScripts.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import { observe } from '../ObserveDom/ObserveDom.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'
import * as PatchCanvasElements from '../PatchCanvasElements/PatchCanvasElements.ts'
import * as PreviewStates from '../PreviewStates/PreviewStates.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'
import * as UpdateContentInProgress from '../UpdateContentInProgress/UpdateContentInProgress.ts'

export const updateContent = async (
  state: PreviewState,
  uri: string,
): Promise<{
  content: string
  css: readonly string[]
  dynamicCanvasCss: readonly string[]
  parsedDom: readonly VirtualDomNode[]
  parsedNodesChildNodeCount: number
  scripts: readonly string[]
  errorMessage: string
}> => {
  // Mark that updateContent is in progress for this uid
  UpdateContentInProgress.set(state.uid)

  try {
    // Read the file content using RendererWorker RPC
    const content = await RendererWorker.readFile(uri)

    // Parse the content into virtual DOM and CSS
    const parseResult = ParseHtml.parseHtml(content)
    let parsedDom = parseResult.dom
    let { css } = parseResult
    const { scripts } = parseResult

    // If scripts are present and not using sandbox worker, execute them via happy-dom and re-serialize the DOM
    if (scripts.length > 0 && !state.useSandboxWorker) {
      try {
        const { document: happyDomDocument, window: happyDomWindow } = createWindow(content)

        // Handle canvas dimension changes by re-serializing and re-rendering
        const handleCanvasDimensionsChange = async (element: any, width: number, height: number, cssRule?: string): Promise<void> => {
          // Get the latest happy-dom state
          console.log('canvas change', width, height)
          const happyDomInstance = HappyDomState.get(state.uid)
          if (!happyDomInstance) {
            console.log('return 1')
            return
          }

          // Re-serialize the DOM with updated canvas dimensions
          const elementMap = new Map<string, any>()
          const serialized = SerializeHappyDom.serialize(happyDomDocument, elementMap)

          // Update happy-dom state
          HappyDomState.set(state.uid, {
            document: happyDomDocument,
            elementMap,
            window: happyDomWindow,
          })

          // Get the current preview state
          const previewStates = PreviewStates.get(state.uid)
          const previewState = previewStates?.newState || previewStates?.oldState
          if (!previewState) {
            console.log('return 2')

            return
          }

          // Update the parsed DOM with new serialization
          const newParsedDom = serialized.dom
          const newCss = serialized.css
          // Add the dynamic CSS rule if provided
          let newDynamicCanvasCss = previewState.dynamicCanvasCss
          if (cssRule) {
            newDynamicCanvasCss = [...newDynamicCanvasCss, cssRule]
            // If updateContent is still in progress, track this CSS rule to return it
            if (UpdateContentInProgress.isUpdating(state.uid)) {
              UpdateContentInProgress.addCssRule(state.uid, cssRule)
            }
          }
          const newParsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(newParsedDom)

          const updatedState = {
            ...previewState,
            css: newCss,
            dynamicCanvasCss: newDynamicCanvasCss,
            parsedDom: newParsedDom,
            parsedNodesChildNodeCount: newParsedNodesChildNodeCount,
          }

          console.log({ cssRule })
          // Update the state
          PreviewStates.set(state.uid, previewStates?.oldState || previewState, updatedState)

          // Only trigger re-render if updateContent has finished
          // If updateContent is still in progress, the updated CSS will be included in the returned data
          if (!UpdateContentInProgress.isUpdating(state.uid)) {
            try {
              await RendererWorker.invoke('Preview.rerender', state.uid)
            } catch {
              // ignore
            }
          }
        }

        HappyDomState.set(state.uid, {
          document: happyDomDocument,
          elementMap: new Map(),
          window: happyDomWindow,
        })
        await PatchCanvasElements.patchCanvasElements(happyDomDocument, state.uid, handleCanvasDimensionsChange)
        ExecuteScripts.executeScripts(happyDomWindow, happyDomDocument, scripts, state.width, state.height)
        const elementMap = new Map<string, any>()
        const serialized = SerializeHappyDom.serialize(happyDomDocument, elementMap)
        parsedDom = serialized.dom
        css = serialized.css
        HappyDomState.set(state.uid, {
          document: happyDomDocument,
          elementMap,
          window: happyDomWindow,
        })
        observe(state.uid, happyDomDocument, happyDomWindow)
      } catch (error) {
        console.error(error)
        // If script execution fails, fall back to static HTML parsing
      }
    }

    const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)

    // Include any dynamic CSS rules generated during updateContent execution (e.g., canvas width/height rules)
    const dynamicCssRules = UpdateContentInProgress.getCssRules(state.uid)
    console.log({ dynamicCssRules })

    return {
      content,
      css,
      dynamicCanvasCss: dynamicCssRules,
      errorMessage: '',
      parsedDom,
      parsedNodesChildNodeCount,
      scripts,
    }
  } catch (error) {
    // If file reading or parsing fails, return empty content and parsedDom with error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      content: '',
      css: [],
      dynamicCanvasCss: [],
      errorMessage,
      parsedDom: [],
      parsedNodesChildNodeCount: 0,
      scripts: [],
    }
  } finally {
    // Mark that updateContent is no longer in progress
    UpdateContentInProgress.remove(state.uid)
  }
}
