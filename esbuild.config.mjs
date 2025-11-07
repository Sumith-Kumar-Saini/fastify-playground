import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: ['esnext'],
  outdir: path.resolve(__dirname, 'dist'),
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  metafile: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  legalComments: 'none',
})
  .then(() => {
    console.log('build complete');
  })
  .catch(() => process.exit(1));
