# Creating a channel file (`.turbotv`)

This guide is for anyone who wants to add a TV channel to TURBO. You need a text editor and the address of the channel's stream. The full format is in [turbotv-format.md](turbotv-format.md).

## Before you start

- Describe only streams that the channel itself publishes for public viewing, or streams you have permission to share. Do not use pirated or leaked streams, or playlists of unknown origin.
- The `license` section is a statement about rights. Be honest in it.
- If you are not the owner of the channel, say so in `license.note`, and ask the channel for permission before you share the file publicly.
- Some channels are blocked or restricted in some countries. List the regions truthfully.
- Streams protected by DRM or by one-time tokens cannot be played. Do not try to work around such protection.

## Steps

1. Copy [`examples/template.turbotv`](../examples/template.turbotv) and rename it, for example `my-channel.turbotv`.
2. Open it in a plain text editor (Notepad, VS Code or similar, not Word) and replace every value that starts with `REPLACE`.
3. Check the stream address. It must start with `https://` and point to an HLS playlist (often ending in `.m3u8`). To test it, open it in VLC: **Media, Open Network Stream**.
4. Save the file as UTF-8.
5. In TURBO, go to **Home, Import channel** and choose the file. If something is wrong, the message names the field to fix. If it is fine, you see a preview and can add the channel.

## What to fill in

| Field | What to write |
| --- | --- |
| `id` | A short name for the channel: lowercase letters, digits, `-` and `.` |
| `updated` | Date and time of your last edit, like `2026-11-14T00:00:00Z` |
| `provider.id`, `provider.name` | Who runs the channel, and a short code for them |
| `provider.website` | The channel's official website (`https`) |
| `provider.contact` | An email or web address for problems and rights questions |
| `channel.name` | The channel's name, up to 80 characters |
| `channel.country` | Two capital letters, like `US` or `CZ`; use `ZZ` for international |
| `channel.languages` | One to five language codes, like `["en"]` or `["ru"]` |
| `channel.category` | One of: `news`, `sports`, `movies`, `series`, `music`, `kids`, `documentary`, `culture`, `education`, `general`, `other` |
| `source.url` | The address of the stream (`https`, HLS) |
| `license.holder` | Who owns or licenses the stream |
| `license.terms_url` | The channel's terms of use (`https`) |
| `license.regions` | Where watching is allowed, like `["CZ", "DE"]`, or `["*"]` if everywhere |
| `license.note` | Optional. For example: "Official file" or "Made by a fan, not approved by the channel" |

## Adding a logo

- Add `"logo": { "url": "https://..." }` inside the `channel` block of your file. Remember the comma after the previous line.
- Use a PNG or WebP image under 2 MiB, at least 128 pixels wide or tall, on a transparent or dark background.
- The address must start with `https://` and must stay available.
- The logo is loaded only after someone adds your channel. If it cannot be loaded, TURBO shows the first letter of the channel name.
- Use only a logo you are allowed to use.

## Writing JSON without mistakes

- Text goes in straight double quotes `"like this"`.
- Put a comma after every line except the last one in each block.
- Comments are not allowed in JSON, so delete the `REPLACE:` words instead of leaving notes.
- The file must be smaller than 64 KiB.

## Common messages in the app

The message names the part that failed: `format`, `version`, `id`, `updated`, `provider`, `channel`, `source`, `license` or `update_url`. Compare that part with the table above. For `version`, make sure it is `0`.

## Sharing your file

Files are shown as **Unverified** until digital signatures are supported. Share only files you made honestly, and remove a channel promptly if its owner asks you to.
