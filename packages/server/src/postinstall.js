import { cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const indexPath = join(root, 'node_modules', '@lvce-editor', 'static-server', 'static', 'index.html')
const content = await readFile(indexPath, 'utf8')
const configPattern = /(<script id="Config" type="application\/json">)(.*?)(<\/script>)/s
const match = configPattern.exec(content)
if (!match) throw new Error('Runtime configuration not found')
const config = JSON.parse(match[2])
const workerPath = join(root, '.tmp', 'dist', 'dist', 'previewWorkerMain.js')
config.workerUrls['develop.previewWorkerPath'] = `/remote/${pathToFileURL(workerPath).toString().slice(8)}`
await writeFile(indexPath, content.replace(match[0], `${match[1]}${JSON.stringify(config)}${match[3]}`))

const sandboxDirectory = fileURLToPath(new URL('./', import.meta.resolve('@lvce-editor/preview-sandbox-worker')))
await cp(
  sandboxDirectory,
  join(root, 'node_modules', '@lvce-editor', 'static-server', 'static', config.assetDir.slice(1), 'packages', 'preview-sandbox-worker', 'dist'),
  { recursive: true, force: true },
)
