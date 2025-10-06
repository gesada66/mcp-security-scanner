/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require('child_process');

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts });
    p.on('exit', code => code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)));
  });
}

(async () => {
  try {
    await run('npm', ['run', 'build:prod']);
    const server = spawn('npm', ['run', 'start:prod'], { shell: process.platform === 'win32' });
    // wait for server to start
    await new Promise(r => setTimeout(r, 5000));
    const flags = [
      'http://localhost:3000',
      '--only-categories=accessibility',
      '--quiet',
      "--chrome-flags=--headless=new --disable-gpu --no-sandbox --ignore-certificate-errors --allow-insecure-localhost --no-first-run --no-default-browser-check",
      '--output=json',
      '--output-path=./lighthouse-a11y-report-final.json'
    ];
    await run('npx', ['lighthouse', ...flags]);
    // kill server
    if (process.platform === 'win32') {
      spawn('taskkill', ['/F', '/IM', 'node.exe']);
    } else {
      server.kill('SIGINT');
    }
    console.log('Lighthouse accessibility report written to lighthouse-a11y-report-final.json');
  } catch (e) {
    console.error('Accessibility run failed:', e.message);
    process.exit(1);
  }
})();


