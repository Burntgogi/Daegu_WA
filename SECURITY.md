# Security patch validation

This is a static production deployment. Development servers and test UIs must stay local or on trusted CI; publish only the production output directory. Responses enforce a script-trust CSP, `nosniff` and strict-origin referrers. Do not add microphone, frame or network restrictions without testing the corresponding app flows.

Compatible lockfile patches are applied without a forced framework major upgrade. `postcss-selector-parser` is fixed to 7.1.6 to retain Tailwind 3. Production dependency audit reports zero findings. Production build and available existing checks were run; no live user records or paid model generation were used.

## Enforced CSP (2026-10-26)

The production policy is enforced through `Content-Security-Policy`, not report-only. Script attributes, arbitrary inline script and string evaluation are blocked. Inline styles remain permitted for the existing React/layout styles; this is not permission for inline JavaScript. Objects, base URL changes, cross-origin form submissions and cross-origin framing are blocked. No report collector receives URLs, prompts or user content.

`npm run build` runs `scripts/build-csp.mjs` after bundling. It hashes trusted emitted scripts, stamps matching SRI attributes into HTML, and generates the matching `_headers` in the deployed output. `script-src` contains only these hashes and `strict-dynamic`, with no `unsafe-inline`, `unsafe-eval`, broad scheme or host fallback. Root third-party scripts must use a trusted local loader. Do not deploy the public source `_headers` directly: it intentionally denies scripts until the build finishes.

Only same-origin, Open-Meteo weather and Open-Meteo air-quality APIs are connect destinations.

Reference: [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), [Next.js nonces and dynamic rendering](https://nextjs.org/docs/app/guides/content-security-policy). Validate both expected UI behavior and blocked injection in a real browser before production promotion.
