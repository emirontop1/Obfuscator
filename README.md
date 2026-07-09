# Obfuscator

Client-side Luau / Lua obfuscator, powered by the [Prometheus](https://github.com/prometheus-lua/Prometheus) engine running fully in the browser via WebAssembly (wasmoon). No installs, no server — paste code, get obfuscated output.

Live: https://emirontop1.github.io/Obfuscator/

## Local development

```bash
cd web
npm install
npm run dev
```

## Build

```bash
cd web
npm run build
```

Deploys automatically to GitHub Pages via GitHub Actions on every push to `main`.

## Credits

Obfuscation engine: [Prometheus](https://github.com/prometheus-lua/Prometheus) by levno-710 / prometheus-lua (MIT licensed, see LICENSE).
