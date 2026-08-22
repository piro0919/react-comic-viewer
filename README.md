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
| className           | `Partial<Record<string, string>>`                          | -       | Custom class names for styling                       |
| text                | `{ expansion?, fullScreen?, move?, normal?, thumbnails? }` | -       | Custom text for UI buttons                           |

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
| Escape      | Exit fullscreen                       |

## Touch Gestures

| Gesture     | Action               |
| ----------- | -------------------- |
| Swipe left  | Navigate pages       |
| Swipe right | Navigate pages       |
| Single tap  | Toggle UI visibility |
| Double tap  | Toggle zoom (2x)     |

## Browser Support

[Full Screen API](https://caniuse.com/fullscreen) is not supported on iOS.
The fullscreen button will not be displayed on unsupported browsers.

## License

MIT
