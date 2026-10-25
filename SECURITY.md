# Security patch validation

This is a static production deployment. Development servers and test UIs must stay local or on trusted CI; publish only the production output directory. Baseline headers enforce `object-src 'none'`, `base-uri 'self'`, `nosniff` and strict-origin referrers. This is not a complete script-source CSP. Do not add microphone, frame or network restrictions without testing the corresponding app flows.

Compatible lockfile patches are applied without a forced framework major upgrade. `postcss-selector-parser` is fixed to 7.1.6 to retain Tailwind 3. Production dependency audit reports zero findings. Production build and available existing checks were run; no live user records or paid model generation were used.
