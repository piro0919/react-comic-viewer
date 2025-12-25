# react-comic-viewer

A comic/manga viewer component for React.

## Demo

[https://react-comic-viewer.kk-web.io](https://react-comic-viewer.kk-web.io)

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

| Prop                | Type                                           | Default | Description                                          |
| ------------------- | ---------------------------------------------- | ------- | ---------------------------------------------------- |
| pages               | `Array<string \| ReactNode>`                   | -       | **Required.** Array of image URLs or React nodes     |
| direction           | `"rtl" \| "ltr"`                               | `"rtl"` | Reading direction                                    |
| initialCurrentPage  | `number`                                       | `0`     | Initial page index                                   |
| initialIsExpansion  | `boolean`                                      | `false` | Initial expansion state                              |
| showPageIndicator   | `boolean`                                      | `false` | Show current page indicator                          |
| switchingRatio      | `number`                                       | `1`     | Aspect ratio threshold for single/double page switch |
| onChangeCurrentPage | `(currentPage: number) => void`                | -       | Callback when page changes                           |
| onChangeExpansion   | `(isExpansion: boolean) => void`               | -       | Callback when expansion state changes                |
| onClickCenter       | `MouseEventHandler<HTMLButtonElement>`         | -       | Callback when center area is clicked                 |
| className           | `Partial<Record<string, string>>`              | -       | Custom class names for styling                       |
| text                | `{ expansion?, fullScreen?, move?, normal?, thumbnails? }` | - | Custom text for UI buttons               |

## Keyboard Shortcuts

| Key         | Action                    |
| ----------- | ------------------------- |
| Arrow Left  | Next page (RTL) / Previous page (LTR) |
| Arrow Right | Previous page (RTL) / Next page (LTR) |
| Escape      | Exit fullscreen           |

## Touch Gestures

| Gesture      | Action              |
| ------------ | ------------------- |
| Swipe left   | Navigate pages      |
| Swipe right  | Navigate pages      |
| Single tap   | Toggle UI visibility |
| Double tap   | Toggle zoom (2x)    |

## Browser Support

[Full Screen API](https://caniuse.com/fullscreen) is not supported on iOS.
The fullscreen button will not be displayed on unsupported browsers.

## License

MIT
