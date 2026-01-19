# Third-Party Notices

Terminal Kit bundles or depends on third-party libraries and assets. Licenses and sources are listed below.

## Runtime Libraries

- Lit (BSD 3-Clause) - https://github.com/lit/lit
- GridStack (MIT) - https://github.com/gridstack/gridstack.js
- iro.js (MPL-2.0) - https://github.com/jaames/iro.js
- marked (MIT) - https://github.com/markedjs/marked
- PrismJS (MIT) - https://github.com/PrismJS/prism

## Icons

- Phosphor Icons (MIT) - https://github.com/phosphor-icons/core
  - Bundled icons: `js/utils/phosphor-icons.js`

## Loaders

- wc-spinners (license per upstream) - https://github.com/craig-jennings/wc-spinners
  - Bundled build: `public/js/libs/wc-spinners.js`
- Epic Spinners (MIT) - https://github.com/epicmaxco/epic-spinners
- React Spinners (MIT) - https://github.com/davidhu2000/react-spinners

## Notes

- `t-chat` uses marked and PrismJS for markdown and code highlighting.
- `t-grid` uses GridStack for draggable/resizable layouts.
- `t-clr` uses iro.js for color picking.
- `t-ldr` wraps wc-spinners and includes spinner sets from Epic Spinners and React Spinners.
