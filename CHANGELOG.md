# Changelog

Earlier releases, up to 1.1.3, are recorded in the git history and on npm.

## Unreleased

### Fixed

- Only the current page and the pages within two turns of it are fetched;
  before, every page image loaded at once. Pages ahead stay mounted as the
  preload, and a page that has been fetched once stays mounted, so turning
  pages shows no blank frame.
- In LTR, the preload fetched pages from the end of the book instead of the
  next ones, because it indexed the reversed page list with a reading-order
  page number.
- The page width comes from the viewer's container, measured with a
  ResizeObserver, instead of the window, so the viewer fits inside sidebars and
  modals. Full-page layout is unchanged.
- The return type of `ComicViewer` is `ReactElement` instead of the global
  `JSX.Element`, which no longer exists in `@types/react` 19.

### Added

- Arrow keys are ignored while focus is in an input, textarea, select or
  contenteditable element, and while a modifier key is held.
- The thumbnails overlay is a modal dialog: it is labelled, takes focus on open,
  keeps Tab inside, closes on Escape and gives focus back on close.
- Accessible names for the full screen close button, the thumbnails close
  button and the page slider.
- New `text` keys for every accessible name: `nextPage`, `prevPage`,
  `centerAction`, `exitFullScreen`, `close`, `pageSlider`. The defaults are the
  previous English strings.
- `className` lists its keys (`ComicViewerClassNames`) for editor completion.
  Other keys are still accepted.
- CSS custom properties `--comic-viewer-navigation-icon-color` (default `#888`)
  and `--comic-viewer-navigation-icon-size` (default `64px`) for the page-turn
  chevrons.
- Thumbnails load lazily.
- Exported types `ComicViewerClassNameKey`, `ComicViewerClassNames` and
  `ComicViewerText`.
