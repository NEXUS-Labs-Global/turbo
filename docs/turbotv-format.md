# TURBO channel file format (`.turbotv`), version 0

**Status:** draft. Everything here can still change before the first release.

## 1. Overview

A `.turbotv` file describes **one TV channel**: who provides it, where to watch it and under what terms. It does not contain video. Think of it as a *pass*: opening it tells the app which channel to add, and the app then reaches the channel over the internet.

Version 0 covers only **open, official streams**. There are no accounts, no activation and no offline downloads yet. Those are planned for version 1 and their field names are reserved (section 9).

This is **not an IPTV format.** Playlists such as `.m3u` are not supported, and a file must not point to streams the provider has no right to distribute.

| Kind | Extension | What it is |
| --- | --- | --- |
| Channel | `.turbotv` | One channel, UTF-8 JSON text, at most 64 KiB |
| Pack | `.turbopack` (proposed) | A ZIP archive with several channel files |

## 2. Channel file

```json
{
  "format": "turbotv",
  "version": 0,
  "id": "world-news",
  "updated": "2026-11-12T12:00:00Z",
  "provider": { "id": "example-media", "name": "Example Media", "website": "https://example.com", "contact": "support@example.com" },
  "channel":  { "name": "Example World News", "country": "ZZ", "languages": ["en"], "category": "news" },
  "source":   { "type": "hls", "url": "https://streams.example.com/world-news/index.m3u8" },
  "license":  { "holder": "Example Media", "terms_url": "https://example.com/terms", "regions": ["*"] }
}
```

A full example is in [`examples/example-channel.turbotv`](../examples/example-channel.turbotv).

### Top-level fields

| Field | Required | Type | Rules |
| --- | --- | --- | --- |
| `format` | yes | string | Must be `"turbotv"` |
| `version` | yes | integer | `0` for this document |
| `id` | yes | string | Channel id, unique for the provider. Lowercase letters, digits, `-` and `.`; 1 to 64 characters |
| `updated` | yes | string | UTC date and time, ISO 8601 (`2026-11-12T12:00:00Z`) |
| `provider` | yes | object | See below |
| `channel` | yes | object | See below |
| `source` | yes | object | See below |
| `license` | yes | object | See below |
| `update_url` | no | string | `https` address where the latest version of this file can be fetched |
| `signature` | no | object | See section 4 |

The global identity of a channel is `provider.id` + `/` + `id`. Importing a file with the same identity replaces the older one if its `updated` value is newer.

### `provider`

| Field | Required | Rules |
| --- | --- | --- |
| `id` | yes | Same character rules as `id` |
| `name` | yes | 1 to 80 characters |
| `website` | yes | `https` address |
| `contact` | recommended | Email or `https` address for support and rights complaints. Will be required for store listings in version 1 |

### `channel`

| Field | Required | Rules |
| --- | --- | --- |
| `name` | yes | 1 to 80 characters |
| `country` | yes | ISO 3166-1 alpha-2 code in capitals, or `ZZ` for international |
| `languages` | yes | 1 to 5 BCP 47 tags, for example `["en", "es-MX"]` |
| `category` | yes | One of: `news`, `sports`, `movies`, `series`, `music`, `kids`, `documentary`, `culture`, `education`, `general`, `other` |
| `description` | no | Up to 300 characters, plain text |
| `logo` | no | Object with `url`: an `https` address of a PNG or WebP image, up to 2 MiB |

### `source`

| Field | Required | Rules |
| --- | --- | --- |
| `type` | yes | `"hls"` in version 0 |
| `url` | yes | `https` address of the HLS manifest (`.m3u8`) |

### `license`

The provider's statement about its rights.

| Field | Required | Rules |
| --- | --- | --- |
| `holder` | yes | Name of the rights holder or the party that licensed the stream |
| `terms_url` | yes | `https` address of the terms of use |
| `regions` | yes | Array of country codes where watching is permitted, or `["*"]` for everywhere |
| `note` | no | Up to 300 characters |

`regions` is information for the user. The app may show a notice, but it is not a technical region lock.

### Unknown fields

Readers ignore fields they do not know. Custom extension fields must start with `x-`.

## 3. Reading rules

A reader must:

1. Reject files larger than 64 KiB or that are not valid UTF-8 JSON.
2. Reject files where `format` is not `"turbotv"` or any required field is missing or has the wrong type.
3. Reject files with a `version` higher than it supports, and tell the user to update the app.
4. Reject any address that does not start with `https://`. Addresses using `javascript:`, `data:`, `file:` or similar are always rejected.
5. Show every text value as plain text, never as HTML.

## 4. Signatures (optional in version 0)

Signing proves that the file came from the provider and was not changed.

- Algorithm: **Ed25519**.
- Signed data: the whole JSON file **without** the `signature` member, serialized with the JSON Canonicalization Scheme (RFC 8785).
- `signature` object: `{ "alg": "ed25519", "key_id": "<provider key id>", "value": "<base64 signature>" }`.

Trust in version 0 works like this:

- **Signed file, new provider.** The app shows the provider name, website and key fingerprint and asks: "Trust this provider?" The answer is remembered.
- **Signed file, known provider.** Imported without extra questions. If the key changes, the app warns the user.
- **Unsigned file.** Can be imported after a clear "Unverified" warning.

A central list of trusted providers is planned for the store in version 1.

## 5. Packs (`.turbopack`)

A pack is a standard ZIP archive:

```
pack.json
channels/world-news.turbotv
channels/world-sport.turbotv
logos/world-news.png        (optional)
```

`pack.json`:

```json
{
  "format": "turbopack",
  "version": 0,
  "name": "Example Media: World channels",
  "provider": { "id": "example-media", "name": "Example Media", "website": "https://example.com" },
  "description": "Optional, up to 300 characters.",
  "channels": ["channels/world-news.turbotv", "channels/world-sport.turbotv"]
}
```

Rules:

- Every channel file stays a complete, valid `.turbotv` on its own, with its own signature if any.
- `provider.id` in each channel must match `provider.id` in `pack.json`; otherwise the pack is rejected.
- Inside a pack, `channel.logo` may use `"path": "logos/world-news.png"` instead of `url`.
- Limits: at most 100 channel files, 20 MiB in total after unpacking, 2 MiB per image.
- Allowed contents: `pack.json`, `.turbotv` files in `channels/`, PNG and WebP files in `logos/`. Nothing else.
- Rejected: absolute paths, `..` in paths, symbolic links, archives inside archives, files that unpack to more than the limits (zip bombs).

## 6. Import flow (informative)

1. The user opens a `.turbotv` or `.turbopack` file, or uses "Import" in the app.
2. The app checks size and format (section 3). It does not contact the provider yet.
3. The app shows a preview: provider, channel name, country, languages, category, the host of the stream, license information and whether the file is signed.
4. For a pack, the user can tick which channels to add.
5. Only after the user confirms, the app saves the channels and may load logos.
6. Nothing starts playing automatically.

## 7. Security summary

- Files hold data only, never code.
- `https` only.
- No automatic network requests to the provider before the user confirms.
- Treat all text as plain text.
- Verify signatures when present and warn when they are missing or changed.

## 8. Legal note

The provider declares that it has the right to distribute the stream. The app cannot check this technically. Providers are responsible for their files, and a way to report problems (`provider.contact`) is needed. Do not use this format for streams you have no right to share.

## 9. Reserved for version 1

These names are reserved and ignored by version 0 readers:

- `access`: how to get access (open, or activation through the provider's server).
- `offline`: whether downloads are allowed and for how many days a downloaded copy may be used without checking in.

## 10. Open questions

- Check that `.turbotv` and `.turbopack` do not clash with existing formats before the first release.
- Register a media type (for example `application/vnd.turbo.channel+json`) when the format is stable.
- How provider keys are published and revoked.
- Program guide (EPG) data.
