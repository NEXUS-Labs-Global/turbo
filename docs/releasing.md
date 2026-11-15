# Releasing a new version

The app checks the latest **GitHub release** and tells the user when a newer version exists (menu **About**).

## Steps

1. Change the version in `src-tauri/tauri.conf.json` (for example `0.1.1`). Keep `package.json` the same.
2. Commit the change to `main`.
3. On GitHub open **Releases, Draft a new release**.
4. In **Choose a tag** type a new tag that matches the version with a `v` in front (`v0.1.1`) and choose **Create new tag**.
5. Write the release notes. The app shows them under **What's new**.
6. Press **Publish release**.
7. The workflow **Build installers** starts by itself and attaches the Windows and Linux installers to the release in about 10 minutes.

## Rules

- The tag must be higher than the version inside the installed app, otherwise nobody sees an update.
- Do not mark a release as **pre-release** or leave it as a draft: only published, non-pre-release releases are offered.
- The update check reads the public GitHub API. It works only when the repository (or the repository that holds the releases) is **public**. While the repository is private, the app shows that update information is not available.
- `UPD_REPO` near the top of the update code in `index.html` names the repository that is checked.

## What the update does today

The app only notices a new version and opens the release page, where the user downloads the installer. Installing updates inside the app needs signed update files (Tauri updater) and is planned as the next step.
