import { terminate } from '@lvce-editor/viewlet-registry'
import * as StatusBar from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import { initialize } from '../Initialize/Initialize.ts'
import * as ItemLeftUpdate from '../ItemLeftUpdate/ItemLeftUpdate.ts'
import * as ItemRightCreate from '../ItemRightCreate/ItemRightCreate.ts'
import * as ItemRightUpdate from '../ItemRightUpdate/ItemRightUpdate.ts'
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
  'StatusBar.handleClick': wrapCommand(HandleClick.handleClick),
  'StatusBar.initialize': initialize,
  'StatusBar.itemLeftUpdate': wrapCommand(ItemLeftUpdate.itemLeftUpdate),
  'StatusBar.itemRightCreate': wrapCommand(ItemRightCreate.itemRightCreate),
  'StatusBar.itemRightUpdate': wrapCommand(ItemRightUpdate.itemRightUpdate),
  'StatusBar.loadContent': wrapCommand(LoadContent.loadContent),
  'StatusBar.render2': render2,
  'StatusBar.renderEventListeners': renderEventListeners,
  'StatusBar.resize': wrapCommand(resize),
  'StatusBar.saveState': wrapGetter(saveState),
  'StatusBar.terminate': terminate,
}
