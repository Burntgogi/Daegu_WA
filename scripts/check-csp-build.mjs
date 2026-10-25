import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const builder = fileURLToPath(new URL('./build-csp.mjs', import.meta.url));
function fixture(html, check) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'csp-build-test-'));
  try {
    fs.mkdirSync(path.join(root, 'security'));
    fs.mkdirSync(path.join(root, 'dist/assets'), { recursive: true });
    fs.writeFileSync(path.join(root, 'security/csp.json'), JSON.stringify({ output: 'dist', connect: "'self'" }));
    fs.writeFileSync(path.join(root, 'dist/index.html'), html);
    fs.writeFileSync(path.join(root, 'dist/assets/app.js'), 'window.appLoaded = true;');
    const result = spawnSync(process.execPath, [builder], { cwd: root, encoding: 'utf8' });
    check(root, result);
  } finally {
    const expectedPrefix = path.resolve(os.tmpdir()) + path.sep + 'csp-build-test-';
    if (!path.resolve(root).startsWith(expectedPrefix)) throw new Error('Unexpected temporary cleanup target');
    fs.rmSync(root, { recursive: true, force: true });
  }
}
test('emitted HTML integrity and enforced header authorize the exact bundled bytes', () => {
  fixture('<html><script type="module" src="/assets/app.js"></script></html>', (root, result) => {
    assert.equal(result.status, 0, result.stderr);
    const hash = 'sha256-' + crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'dist/assets/app.js'))).digest('base64');
    assert.ok(fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8').includes(`integrity="${hash}"`));
    const headers = fs.readFileSync(path.join(root, 'dist/_headers'), 'utf8');
    assert.ok(headers.includes(`script-src '${hash}' 'strict-dynamic'`));
    assert.ok(!headers.includes('Content-Security-Policy-Report-Only'));
    assert.ok(!/script-src [^;]*'unsafe-/.test(headers));
  });
});
test('uncontrolled remote root scripts cannot silently bypass the build policy', () => {
  fixture('<script src="https://untrusted.example/code.js"></script>', (_root, result) => assert.notEqual(result.status, 0));
});
test('event-handler attributes and path escapes fail closed', () => {
  for (const html of ['<button onclick="attack()">go</button>', '<script src="/../private.js"></script>']) {
    fixture(html, (_root, result) => assert.notEqual(result.status, 0));
  }
});
