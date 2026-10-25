import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Hash only trusted build output. Never hash user content or response-time input.
const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, 'security/csp.json'), 'utf8'));
const output = path.resolve(root, config.output);
if (!output.startsWith(root + path.sep)) throw new Error('CSP output must be inside the repository');
const hashes = new Set();
const digest = body => 'sha256-' + crypto.createHash('sha256').update(body).digest('base64');
const htmlFiles = [];
function walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) htmlFiles.push(file);
  }
}
walk(output);
if (!htmlFiles.length) throw new Error('No built HTML to secure');
for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (whole, attributes, body) => {
    if (/\btype\s*=\s*["'](?:application\/ld\+json|application\/json|importmap)["']/i.test(attributes)) {
      if (/importmap/i.test(attributes)) hashes.add(digest(Buffer.from(body)));
      return whole;
    }
    const source = attributes.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2];
    let hash;
    if (source) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(source)) throw new Error('Root scripts must be local; use a trusted local loader for third parties');
      const urlPath = source.split(/[?#]/)[0];
      const asset = path.resolve(source.startsWith('/') ? output : path.dirname(file), source.startsWith('/') ? '.' + urlPath : urlPath);
      if (!asset.startsWith(output + path.sep)) throw new Error('Script escaped build output');
      hash = digest(fs.readFileSync(asset));
      attributes = attributes.replace(/\s+(?:integrity|crossorigin)\s*=\s*(["']).*?\1/gi, '');
      attributes += ` integrity="${hash}" crossorigin="anonymous"`;
    } else hash = digest(Buffer.from(body));
    hashes.add(hash);
    return `<script${attributes}>${body}</script>`;
  });
  if (/\son[a-z]+\s*=/i.test(html)) throw new Error('Inline event handlers must be replaced with addEventListener');
  fs.writeFileSync(file, html);
}
const policy = [
  "default-src 'self'",
  `script-src ${[...hashes].sort().map(hash => `'${hash}'`).join(' ')} 'strict-dynamic'`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://hangeul.naver.com",
  "font-src 'self' data: https://fonts.gstatic.com https://hangeul.naver.com",
  "img-src 'self' data: blob: https:",
  `connect-src ${config.connect}`,
  "worker-src 'self' blob:",
  "media-src 'self' blob: data: https:",
  `frame-src ${config.frames || "'none'"}`,
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');
fs.writeFileSync(path.join(output, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Content-Security-Policy: ${policy}\n`);
if (config.module) {
  const destination = path.resolve(root, config.module);
  if (!destination.startsWith(root + path.sep)) throw new Error('CSP module must be inside the repository');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `// Generated with the production HTML by scripts/build-csp.mjs.\nexport const contentSecurityPolicy = ${JSON.stringify(policy)};\n`);
}
console.log(`Enforced hash CSP: ${htmlFiles.length} HTML file(s), ${hashes.size} trusted script hash(es).`);
