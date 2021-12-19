# react-comic-viewer

react-comic-viewer is comic viewer for react.

## Features

- SSR support
- TypeScript support

## Installation

`npm i --save react-comic-viewer`

## Usage

```tsx
import React from "react";
import ComicViewer from "react-comic-viewer";

function App() {
  return (
    <ComicViewer pages={["hoge.png", "fuga.jpg", "piyo.jpg", "moge.jpg"]} />
  );
}

export default App;
```

## Props

| Return              |   Type   | Required |
| ------------------- | :------: | :------: |
| direction           |  String  |          |
| initialCurrentPage  |  Number  |          |
| initialIsExpansion  | Boolean  |          |
| onChangeCurrentPage | Function |          |
| onChangeExpansion   | Function |          |
| onClickCenter       | Function |          |
| pages               |  Array   |    ✓     |
| switchingRatio      |  Number  |          |
| text                |  Object  |          |

## Support

[Full Screen API](https://caniuse.com/fullscreen) does not support iOS.

Therefore, the full screen button is not displayed on iOS.
