# Building the desktop app

The desktop app is built with [Tauri 2](https://v2.tauri.app/). Installers for Windows and Linux are built automatically on GitHub.

## Build installers on GitHub (no setup on your computer)

1. Open the repository on GitHub, then the **Actions** tab.
2. Choose **Build installers** in the list on the left, then **Run workflow**.
3. Wait until the run turns green (about 10 to 20 minutes).
4. Open the run and download the files under **Artifacts**:
   - `turbo-windows-latest`: Windows installer (`.exe`)
   - `turbo-ubuntu-22.04`: Linux packages (`.deb` and `.AppImage`)

Pushing a tag that starts with `v` (for example `v0.1.0`) also starts a build.

## Build on your own computer (optional)

Install [Node.js](https://nodejs.org), [Rust](https://www.rust-lang.org/tools/install) and the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your system, then:

```
npm install
npx tauri icon app-icon.png
npx tauri dev      # run the app
npx tauri build    # build installers
```

## How it is put together

- `index.html` is the single source of the interface. It also works as a plain web page.
- `scripts/prepare.mjs` copies it into `src/` and replaces the online hls.js link with a local copy, so playback does not need a CDN.
- `src-tauri/` holds the Tauri configuration and the small Rust launcher.
- `app-icon.png` is the source of all app icons; they are generated during the build.

## Things to change before a public release

- `identifier` in `src-tauri/tauri.conf.json` (currently `dev.turbo.player`): use a reverse-domain name you control.
- `security.csp` is `null` for now; tighten it once everything works.
- Code signing for Windows and Linux packages is not set up yet.
