const { spawn } = require('child_process');
const path = require('path');

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
    // wait a bit for server
    await new Promise(r => setTimeout(r, 5000));
    await run('npx', ['lighthouse', 'http://localhost:3000', '--only-categories=performance', '--quiet', "--chrome-flags='--headless=new'", '--output=json', '--output-path=./lighthouse-perf-report-phase4.json']);
    // kill server
    if (process.platform === 'win32') {
      spawn('taskkill', ['/F', '/IM', 'node.exe']);
    } else {
      server.kill('SIGINT');
    }
    console.log('Lighthouse performance report written to lighthouse-perf-report-phase4.json');
  } catch (e) {
    console.error('Performance run failed:', e.message);
    process.exit(1);
  }
})();


