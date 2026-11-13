<p align="center">
  <img src="assets/banner.png" alt="TURBO" width="640">
</p>

<p align="center">
  <strong>Pre-alpha UI prototype of a desktop app shell.</strong><br>
  No real authentication. Please do not enter real passwords.
</p>

---

## Status

This repository contains an interface prototype only. There is no backend, so:

- Sign-in and sign-up check that the fields look valid, but nothing is sent anywhere and no account is really created.
- The **Google / Apple / Microsoft** buttons are placeholders. They fill in a demo name (`Alex Morgan`) instead of the real name from the service.
- Data is saved only in your own browser (`localStorage`), never on a server.

## Features

- Welcome screen, then a setup menu, then the Homepage, with smooth transitions
- Black theme with white buttons and a colored accent
- Languages: English (default) and Russian
- Accent colors: purple, blue, orange, red, green
- Three text sizes; keyboard navigation, visible focus, respects the system "reduce motion" setting
- Floating background and screen transitions that can be turned off
- Sidebar with an animated active indicator and a top-to-bottom press animation
- Guest mode (name and photo are locked) and account mode (editable first name, last name and photo)
- Settings and profile are kept between launches; the password is never stored

## Channel files

Channels are added with small `.turbotv` files (one channel each); several channels can be shipped as a `.turbopack` archive. The draft format is described in [docs/turbotv-format.md](docs/turbotv-format.md), with an [example](examples/example-channel.turbotv).

## Run it

No build step is needed. Open `index.html` in any modern browser.

To publish it as a website with GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**.

## Roadmap

- [ ] Real authentication (own accounts, then Google / Apple / Microsoft sign-in)
- [ ] Per-account profiles
- [ ] Support contact and backup (recovery) codes
- [ ] Real Homepage content
- [ ] Packaging as a desktop app

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole prototype in one file |
| `docs/turbotv-format.md` | Draft specification of the `.turbotv` channel format |
| `examples/example-channel.turbotv` | Example channel file (fictional provider) |
| `LICENSE` | PolyForm Noncommercial License 1.0.0 |
| `assets/logo.png` | Logo with transparent background (light-colored, made for dark backgrounds) |
| `assets/banner.png` | Logo on black, used in this README |

## License

The source code is available under the [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0) (see `LICENSE`). You may use, study and modify it for personal and other noncommercial purposes. Any commercial use needs separate permission from the author.

The TURBO name and the logo files in `assets/` are not covered by this license. All rights reserved.
