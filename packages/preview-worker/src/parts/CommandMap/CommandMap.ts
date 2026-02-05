import { terminate } from '@lvce-editor/viewlet-registry'
import * as StatusBar from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { getCommandIds, wrapCommand, wrapGetter } from '../PreviewStates/PreviewStates.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { resize } from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'

export const commandMap = {
  'StatusBar.create': StatusBar.create,
  'StatusBar.diff2': diff2,
  'StatusBar.getCommandIds': getCommandIds,
  'StatusBar.loadContent': wrapCommand(LoadContent.loadContent),
  'StatusBar.render2': render2,
  'StatusBar.renderEventListeners': renderEventListeners,
  'StatusBar.resize': wrapCommand(resize),
  'StatusBar.saveState': wrapGetter(saveState),
  'StatusBar.terminate': terminate,
}
