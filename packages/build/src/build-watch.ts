import { execa } from 'execa'
import { root } from './root.js'

const main = async () => {
  execa(
    `bash`,
    [
      '-c',
      `./packages/build/node_modules/.bin/esbuild --format=esm --bundle --external:node:buffer --external:electron --external:ws --external:node:worker_threads --watch packages/preview-worker/src/previewWorkerMain.ts --outfile=.tmp/dist/dist/previewWorkerMain.js`,
    ],
    {
      cwd: root,
      stdio: 'inherit',
    },
  )
}

main()
