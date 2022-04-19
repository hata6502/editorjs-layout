<!-- markdownlint-disable first-line-h1 -->

<h1 align="center">Welcome to editorjs-layout 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/editorjs-layout" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/editorjs-layout.svg">
  </a>
  <a href="https://github.com/hata6502/editorjs-layout/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/hata6502" target="_blank">
    <img alt="Twitter: hata6502" src="https://img.shields.io/twitter/follow/hata6502.svg?style=social" />
  </a>
</p>

> Layout block tool for Editor.js.

Alternative solution: [editorjs-inline](https://github.com/hata6502/editorjs-inline)

### ✨ [Demo](https://hata6502.github.io/editorjs-layout/)

![demo](https://user-images.githubusercontent.com/7702653/105721139-97eb9100-5f67-11eb-8dca-dd4d89314377.gif)

## Install

### Install via yarn

```sh
yarn add editorjs-layout
```

### Load from CDN

```html
<script src="https://cdn.jsdelivr.net/npm/editorjs-layout@latest"></script>
```

## Usage

Please see [demo HTML](https://github.com/hata6502/editorjs-layout/blob/main/docs/index.html).

## Config params

Please see type declaration of [LayoutBlockToolConfig](https://github.com/hata6502/editorjs-layout/blob/main/src/LayoutBlockTool.ts).

## Output data

Please see type declaration of [ValidatedLayoutBlockToolData](https://github.com/hata6502/editorjs-layout/blob/main/src/LayoutBlockTool.ts).

## Copied data

Please see type declaration of [LayoutBlockToolData](https://github.com/hata6502/editorjs-layout/blob/main/src/LayoutBlockTool.ts).

NOTE:
Copied block data by `ctrl+c` are not [validated](https://editorjs.io/blockapi#methods).
So copied block data and output block data may be different.
Please see also [this comment](https://github.com/codex-team/editor.js/issues/1280#issuecomment-706482368).

## Build

```sh
yarn webpack
```

## Format

```sh
yarn fix
```

## Run tests

```sh
yarn test
```

## Author

<img alt="Tomoyuki Hata" src="https://avatars.githubusercontent.com/hata6502" width="48" /> **Tomoyuki Hata <hato6502@gmail.com>**

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/hata6502/editorjs-layout/issues).

## Show your support

Give a ⭐️ if this project helped you!

## Disclaimer

The following creations are included in this product:

- [ionic-team/ionicons](https://github.com/ionic-team/ionicons/blob/master/LICENSE)

Please see also [DISCLAIMER.md](https://github.com/hata6502/editorjs-layout/blob/main/DISCLAIMER.md).

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
