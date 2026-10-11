import { cp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.js'

const sharedProcessPath = join(root, 'node_modules', '@lvce-editor', 'shared-process', 'index.js')
const sharedProcess = await import(pathToFileURL(sharedProcessPath).toString())

const pathPrefix = '/preview-worker'
process.env.PATH_PREFIX = pathPrefix
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

const indexPath = join(root, 'dist', 'index.html')
const content = await readFile(indexPath, 'utf8')
const configPattern = /(<script id="Config" type="application\/json">)(.*?)(<\/script>)/s
const match = configPattern.exec(content)
if (!match) throw new Error('Exported runtime configuration not found')
const config = JSON.parse(match[2])
config.workerUrls['develop.previewWorkerPath'] = `${pathPrefix}/${commitHash}/packages/preview-worker/dist/previewWorkerMain.js`
await writeFile(indexPath, content.replace(match[0], `${match[1]}${JSON.stringify(config)}${match[3]}`))
await cp(
  new URL('./', import.meta.resolve('@lvce-editor/preview-sandbox-worker')),
  join(root, 'dist', commitHash, 'packages', 'preview-sandbox-worker', 'dist'),
  { recursive: true, force: true },
)
await cp(join(root, '.tmp', 'dist', 'dist'), join(root, 'dist', commitHash, 'packages', 'preview-worker', 'dist'), { recursive: true })

const staticDirectory = join(root, '.tmp', 'static')
await rm(staticDirectory, { recursive: true, force: true })
await cp(join(root, 'dist'), staticDirectory, { recursive: true })
