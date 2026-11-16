# Setting up signed updates

The app can install updates by itself. Every update file is signed with a private key that only you have; the app contains the matching public key and refuses anything that is not signed correctly. Do this setup **once**, before the first release that should be updatable.

## 1. Create the signing keys (on your computer)

1. Install [Node.js](https://nodejs.org) (the LTS version) if you do not have it.
2. Open a terminal (PowerShell on Windows) in any folder and run:

   ```
   npx @tauri-apps/cli signer generate -w turbo.key
   ```

3. When asked, enter a password and remember it. Two files appear: `turbo.key` (private) and `turbo.key.pub` (public).

**Keep `turbo.key` and the password safe** (for example in a password manager) and make a backup. Never commit them, never send them anywhere, never paste them into a chat. If you lose them, installed copies of the app can no longer be updated automatically; people would have to install a new version by hand.

## 2. Give GitHub the private key

In the repository open **Settings, Secrets and variables, Actions, New repository secret** and create two secrets:

| Name | Value |
| --- | --- |
| `TAURI_SIGNING_PRIVATE_KEY` | The whole content of `turbo.key` (open it in Notepad, select all, copy) |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | The password you chose |

## 3. Put the public key into the app

Open `turbo.key.pub`, copy its content (one long line) and paste it in `src-tauri/tauri.conf.json` instead of `REPLACE_WITH_PUBLIC_KEY`, keeping the quotation marks. Then commit the file.

## 4. Check the update address

In the same file, `endpoints` must point to the latest release of your repository:
`https://github.com/<owner>/<repository>/releases/latest/download/latest.json`.

## Important rules

- **The repository must be public.** The app downloads updates without logging in, and GitHub does not allow that for private repositories. Until then the update check ends with an error.
- **The first updatable version has to be installed by hand.** Versions built before this setup do not contain the updater.
- **Raise the version for every release** in `src-tauri/tauri.conf.json`, then publish a release whose tag is that version with a `v` in front (see [releasing.md](releasing.md)). The updater compares these numbers.
- On Linux only the `.AppImage` version updates itself; the `.deb` package is updated by hand.
- On Windows the installer closes the app and starts the new version. On Linux the app restarts itself.

## How to test

1. Build and install version `0.1.1` (tag `v0.1.1`).
2. Raise the version to `0.1.2`, publish tag `v0.1.2`, wait for the workflow to finish.
3. In the installed app open **About, Check for updates**, then **Install update**.
