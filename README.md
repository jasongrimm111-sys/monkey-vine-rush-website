# monkeyvinerush.com

The website for **Monkey Vine Rush**, a game by Jason Grimmitt (Grimmitt Games), served by GitHub Pages at https://monkeyvinerush.com.

The site comes in all 16 of the app's languages. English is at the root (`/`, `/support/`, `/privacy/`) and each other language is under its code (`/es/`, `/es/support/`, ...).

## Editing

Don't edit the generated `index.html` files. Edit the sources in `src/`, then rebuild:

```
node src/build.js
```

- `src/home.html`, `src/support.html`, `src/privacy.html`: page templates; `{{key}}` marks text
- `src/i18n/<lang>.json`: the text for each language (`en.json` is the source)
- `src/build.js`: fills the templates, writes every language, the sitemap and robots.txt
- `assets/`: styles; `img/`: icon, screenshots, trailer and share image; `CNAME`: the domain

The old support and privacy pages in the `monkey-vine-rush-privacy` repo forward here.
