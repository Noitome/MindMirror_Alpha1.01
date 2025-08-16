# MindMirror Alpha 1.0

This release migrates the project to a React + Vite setup.

## Project structure

```
/                Project root with Vite configuration
├─ index.html    HTML entry point
├─ jsconfig.json JSX compiler options
├─ package.json  NPM package configuration
├─ vite.config.js Vite configuration
├─ src/          React source files
│  ├─ App.jsx
│  └─ main.jsx
└─ dist/         Build output (generated, ignored)
```

No legacy Python/Tkinter files are present in this version.

## Deployment & Packaging

- `.github/workflows/react.yml` installs dependencies, lints, runs tests, builds the Vite frontend and deploys the `dist/` folder to GitHub Pages.
- `.github/workflows/python.yml` packages an optional Python tracker with PyInstaller when files exist under `tracker/`.

The React build and Python binary can later be bundled together with frameworks like Electron or Tauri to produce a unified desktop application.
