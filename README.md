# react-comic-viewer

react-comic-viewer is comic viewer for react.

## Features

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

## Return

| Key            | Type                           | Description                    | default |
| -------------- | ------------------------------ | ------------------------------ | ------- |
| pages          | Array<string &#124; ReactNode> | Comic Pages                    | -       |
| switchingRatio | number &#124; undefined        | Ratio to switch to single page | 1       |
