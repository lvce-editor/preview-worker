import { join } from 'node:path'
import { root } from './root.ts'

// Preview Sandbox Output RPC handlers add approximately 1.1 kB to worker startup.
export const threshold = 532_000

export const instantiations = 220_000

export const instantiationsPath = join(root, 'packages', 'preview-worker')

export const workerPath = join(root, '.tmp/dist/dist/previewWorkerMain.js')

export const playwrightPath = new URL('../../../node_modules/playwright/index.mjs', import.meta.url).toString()
