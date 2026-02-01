const { spawnSync } = require('child_process');
const path = require('path');

const port = process.env.PORT || '4301';
process.env.PORT = port;

const nextBin = path.join(
  path.dirname(require.resolve('next/package.json')),
  'dist/bin/next'
);

const result = spawnSync(process.execPath, [nextBin, 'start', '-p', port], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
