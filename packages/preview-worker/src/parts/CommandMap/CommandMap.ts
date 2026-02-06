import { terminate } from '@lvce-editor/viewlet-registry'
import * as Preview from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import { handleEditorChanged } from '../HandleEditorChanged/HandleEditorChanged.ts'
import { handleFileEdited } from '../HandleFileEdited/HandleFileEdited.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { getCommandIds, wrapCommand, wrapGetter } from '../PreviewStates/PreviewStates.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { rerender } from '../Rerender/Rerender.ts'
import { resize } from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'
import { setUri } from '../SetUri/SetUri.ts'

export const commandMap = {
  handleEditorChanged: handleEditorChanged,
  'Preview.create': Preview.create,
  'Preview.diff2': diff2,
  'Preview.getCommandIds': getCommandIds,
  'Preview.handleClick': wrapCommand(HandleClick.handleClick),
  'Preview.handleFileEdited': wrapCommand(handleFileEdited),
  'Preview.loadContent': wrapCommand(LoadContent.loadContent),
  'Preview.render2': render2,
  'Preview.renderEventListeners': renderEventListeners,
  'Preview.rerender': wrapCommand(rerender),
  'Preview.resize': wrapCommand(resize),
  'Preview.saveState': wrapGetter(saveState),
  'Preview.setUri': wrapCommand(setUri),
  'Preview.terminate': terminate,
}
