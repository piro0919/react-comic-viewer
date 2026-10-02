# react-comic-viewer

A comic/manga viewer component for React.

## Demo

[https://react-comic-viewer.kkweb.io](https://react-comic-viewer.kkweb.io)

## Features

- RTL (right-to-left) and LTR support for manga/comic reading
- Responsive single/double page view
- Fullscreen mode
- Swipe navigation on touch devices
- Keyboard navigation (Arrow keys, Escape)
- Double-tap to zoom
- Tap to show/hide UI
- Thumbnail navigation
- Loading indicator
- Page preloading
- TypeScript support

## Requirements

- React 18 or later

## Installation

```bash
npm install react-comic-viewer
```

## Usage

```tsx
import { ComicViewer } from "react-comic-viewer";
import "react-comic-viewer/styles.css";

function App() {
  return (
    <ComicViewer pages={["page1.jpg", "page2.jpg", "page3.jpg", "page4.jpg"]} />
  );
}

export default App;
```

## Props

| Prop                | Type                                                       | Default | Description                                          |
| ------------------- | ---------------------------------------------------------- | ------- | ---------------------------------------------------- |
| pages               | `Array<string \| ReactNode \| PageRenderer>`               | -       | **Required.** Image URLs, React nodes, or renderers   |
| direction           | `"rtl" \| "ltr"`                                           | `"rtl"` | Reading direction                                    |
| currentPage         | `number`                                                   | -       | Controls the current page. See Controlled mode        |
| isExpansion         | `boolean`                                                  | -       | Controls the expansion state. See Controlled mode     |
| initialCurrentPage  | `number`                                                   | `0`     | Initial page index, used when uncontrolled            |
| initialIsExpansion  | `boolean`                                                  | `false` | Initial expansion state, used when uncontrolled       |
| showPageIndicator   | `boolean`                                                  | `false` | Show current page indicator                          |
| switchingRatio      | `number`                                                   | `1`     | Aspect ratio threshold for single/double page switch |
| onChangeCurrentPage | `(currentPage: number) => void`                            | -       | Callback when page changes                           |
| onChangeExpansion   | `(isExpansion: boolean) => void`                           | -       | Callback when expansion state changes                |
| onTryMoveNextPage   | `(nextPage: number) => void`                               | -       | Fired before moving forward                           |
| onTryMovePrevPage   | `(prevPage: number) => void`                               | -       | Fired before moving back                              |
| onClickCenter       | `MouseEventHandler<HTMLButtonElement>`                     | -       | Callback when center area is clicked                 |
| className           | `ComicViewerClassNames`                                    | -       | Custom class names per element. See below            |
| text                | `ComicViewerText`                                          | -       | Custom text for buttons and accessible names. See below |

### `className`

Extra class names, keyed by element: `wrapper`, `viewer`, `pagesWrapper`,
`page`, `img`, `nextNavigationButton`, `prevNavigationButton`, `centerButton`,
`pageIndicator`, `closeButton`, `controller`, `mainController`,
`subController`, `scaleController`, `rangeInput`, `expansionControlButton`,
`fullScreenControlButton`, `showMoveControlButton`, `thumbnailsControlButton`,
`thumbnailsContainer`, `thumbnailItem`.

### `text`

| Key            | Default              | Used for                                   |
| -------------- | -------------------- | ------------------------------------------ |
| expansion      | `"Expansion"`        | Expansion button                           |
| normal         | `"Normal"`           | Expansion button while expanded            |
| fullScreen     | `"Full screen"`      | Full screen button                         |
| move           | `"Move"`             | Move button                                |
| thumbnails     | `"Thumbnails"`       | Thumbnails button and dialog title         |
| nextPage       | `"Next page"`        | Accessible name of the next page button    |
| prevPage       | `"Previous page"`    | Accessible name of the previous page button |
| centerAction   | `"Center action"`    | Accessible name of the center button       |
| exitFullScreen | `"Exit full screen"` | Accessible name of the full screen close button |
| close          | `"Close"`            | Accessible name of the thumbnails close button |
| pageSlider     | `"Page"`             | Accessible name of the page slider         |

## Sizing

The viewer takes the width of its container, measured with a ResizeObserver, so
it fits a sidebar or a modal as well as the full page. Its height follows the
viewport: the viewport height minus 95px, between 440px and 840px, or the full
viewport height when expanded.

## Theming

| Custom property                       | Default | Applies to                 |
| ------------------------------------- | ------- | -------------------------- |
| `--comic-viewer-navigation-icon-color` | `#888`  | Next/previous page chevrons |
| `--comic-viewer-navigation-icon-size`  | `64px`  | Next/previous page chevrons |

Set them on the viewer's `wrapper` class or any ancestor.

## Loading

Only the current page and the pages within two turns of it are fetched. The
ones ahead double as the preload, so the next page is already decoded when the
reader turns to it. A page stays loaded once it has been fetched. Thumbnails
use `loading="lazy"`.

## Controlled mode

By default the viewer owns `currentPage` and `isExpansion`, and reports changes
through `onChangeCurrentPage` / `onChangeExpansion`.

Pass `currentPage` or `isExpansion` to take that state over. The viewer then
renders whatever you give it and never writes the value itself — the callbacks
become requests you are free to ignore. This is what lets you drive the viewer
from a table of contents, keep it in sync with the URL, or refuse a move.

```tsx
const [currentPage, setCurrentPage] = useState(0);

<ComicViewer
  currentPage={currentPage}
  pages={pages}
  onTryMoveNextPage={(nextPage) => {
    // Runs before the move. Good place to prefetch or to gate a chapter.
  }}
  onChangeCurrentPage={setCurrentPage}
/>;
```

Each prop is independent: controlling `currentPage` leaves `isExpansion`
uncontrolled, and the other way around.

## Rendering your own pages

An entry of `pages` may be a function receiving the class name the viewer would
have applied to its own `<img>`. Use it to bring your own image element, for
lazy loading or a custom placeholder.

```tsx
const pages: PageRenderer[] = urls.map(
  (url) =>
    ({ className }) =>
      <img src={url} alt="" className={className} loading="lazy" />,
);
```

The function is called during render, so it may not use hooks.

## Keyboard Shortcuts

| Key         | Action                                |
| ----------- | ------------------------------------- |
| Arrow Left  | Next page (RTL) / Previous page (LTR) |
| Arrow Right | Previous page (RTL) / Next page (LTR) |
| Escape      | Exit fullscreen / close thumbnails    |

The keys are read on the window, so a full-page viewer needs no focus. They are
ignored while focus is in an input, textarea, select or contenteditable
element, and while Alt, Ctrl, Meta or Shift is held. While the thumbnails are
open, focus stays inside them and the arrow keys do not turn pages.

## Touch Gestures

| Gesture     | Action               |
| ----------- | -------------------- |
| Swipe left  | Navigate pages       |
| Swipe right | Navigate pages       |
| Single tap  | Toggle UI visibility |
| Double tap  | Toggle zoom (2x)     |

## Web Component

For pages without React, the package also ships a `<comic-viewer>` custom
element. It is the same component running on Preact, with its CSS included, so
it needs nothing else: about 19 kB gzipped.

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/react-comic-viewer/dist/web-component.js"
></script>

<comic-viewer
  pages='["page1.jpg", "page2.jpg", "page3.jpg"]'
  show-page-indicator="true"
></comic-viewer>
```

With a bundler, import it once instead of the script tag:

```js
import "react-comic-viewer/web-component";
```

Props become attributes in kebab-case. `pages`, `text` and `className` take
JSON, booleans take `"true"` or `"false"` (an empty attribute is ignored), and
everything can also be set as a property from JavaScript:

```js
const viewer = document.querySelector("comic-viewer");
viewer.pages = ["page1.jpg", "page2.jpg"];
```

`pages` accepts image URLs only; React nodes and renderers need the React
component.

Callbacks are dispatched as events, named after the prop without `on` and
lowercased, with the argument in `detail`:

| Event               | `detail`                         |
| ------------------- | -------------------------------- |
| `changecurrentpage` | The new page index               |
| `changeexpansion`   | The new expansion state          |
| `trymovenextpage`   | The page about to be moved to    |
| `trymoveprevpage`   | The page about to be moved to    |
| `clickcenter`       | The click event                  |

`clickcenter` needs `center-action="true"`, which renders the center button
that the React component shows when `onClickCenter` is passed.

```js
viewer.addEventListener("changecurrentpage", (event) => {
  console.log(event.detail);
});
```

## Browser Support

[Full Screen API](https://caniuse.com/fullscreen) is not supported on iOS.
The fullscreen button will not be displayed on unsupported browsers.

## License

MIT
