import { terminate } from '@lvce-editor/viewlet-registry'
import * as Preview from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import { dispose } from '../Dispose/Dispose.ts'
import { getGeometryBuffer } from '../GetGeometryBuffer/GetGeometryBuffer.ts'
import { executeCallback, getOffscreenCanvas } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'
import { getRuntimeDiagnostics } from '../GetRuntimeDiagnostics/GetRuntimeDiagnostics.ts'
import * as HandleChange from '../HandleChange/HandleChange.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import { handleFileEdited } from '../HandleFileEdited/HandleFileEdited.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleKeydown from '../HandleKeydown/HandleKeydown.ts'
import * as HandleKeyup from '../HandleKeyup/HandleKeyup.ts'
import * as HandleMousedown from '../HandleMousedown/HandleMousedown.ts'
import * as HandleMousemove from '../HandleMousemove/HandleMousemove.ts'
import * as HandleMouseup from '../HandleMouseup/HandleMouseup.ts'
import { handleMutation } from '../HandleMutation/HandleMutation.ts'
import * as HandlePointerdown from '../HandlePointerdown/HandlePointerdown.ts'
import * as HandlePointermove from '../HandlePointermove/HandlePointermove.ts'
import * as HandlePointerup from '../HandlePointerup/HandlePointerup.ts'
import { initializeGeometryBuffer } from '../InitializeGeometryBuffer/InitializeGeometryBuffer.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { getCommandIds, wrapCommand, wrapGetter } from '../PreviewStates/PreviewStates.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { rerender } from '../Rerender/Rerender.ts'
import { resize } from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'
import { scheduleEditorChanged } from '../ScheduleEditorChanged/ScheduleEditorChanged.ts'
import { setUri } from '../SetUri/SetUri.ts'
import { triggerRerender } from '../TriggerRerender/TriggerRerender.ts'
import { waitForClick } from '../WaitForClick/WaitForClick.ts'
import { waitForMutation } from '../WaitForMutation/WaitForMutation.ts'

export const commandMap = {
  handleEditorChanged: scheduleEditorChanged,
  'Preview.create': Preview.create,
  'Preview.createOffscreenCanvas': wrapGetter(getOffscreenCanvas),
  'Preview.diff2': diff2,
  'Preview.dispose': dispose,
  'Preview.executeCallback': executeCallback,
  'Preview.getCommandIds': getCommandIds,
  'Preview.getGeometryBuffer': wrapGetter(getGeometryBuffer),
  'Preview.getRuntimeDiagnostics': wrapGetter(getRuntimeDiagnostics),
  'Preview.handleChange': wrapCommand(HandleChange.handleChange),
  'Preview.handleClick': wrapCommand(HandleClick.handleClick),
  'Preview.handleFileEdited': wrapCommand(handleFileEdited),
  'Preview.handleInput': wrapCommand(HandleInput.handleInput),
  'Preview.handleKeyDown': wrapCommand(HandleKeydown.handleKeydown),
  'Preview.handleKeyUp': wrapCommand(HandleKeyup.handleKeyup),
  'Preview.handleMousedown': wrapCommand(HandleMousedown.handleMousedown),
  'Preview.handleMousemove': wrapCommand(HandleMousemove.handleMousemove),
  'Preview.handleMouseup': wrapCommand(HandleMouseup.handleMouseup),
  'Preview.handleMutation': wrapCommand(handleMutation),
  'Preview.handlePointerdown': wrapCommand(HandlePointerdown.handlePointerdown),
  'Preview.handlePointermove': wrapCommand(HandlePointermove.handlePointermove),
  'Preview.handlePointerup': wrapCommand(HandlePointerup.handlePointerup),
  'Preview.initializeGeometryBuffer': wrapCommand(initializeGeometryBuffer),
  'Preview.loadContent': wrapCommand(LoadContent.loadContent),
  'Preview.render2': render2,
  'Preview.renderEventListeners': renderEventListeners,
  'Preview.rerender': wrapCommand(rerender),
  'Preview.resize': wrapCommand(resize),
  'Preview.saveState': wrapGetter(saveState),
  'Preview.setUri': wrapCommand(setUri),
  'Preview.terminate': terminate,
  'Preview.triggerRerender': wrapCommand(triggerRerender),
  'Preview.waitForClick': wrapCommand(waitForClick),
  'Preview.waitForMutation': wrapCommand(waitForMutation),
}
