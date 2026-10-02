import r2wc from "@r2wc/react-to-web-component";
import { ComicViewer, type ComicViewerProps } from "./index";

type ComicViewerElementProps = ComicViewerProps & {
  /** Renders the center button, which dispatches `clickcenter`. */
  centerAction?: boolean;
  /** Set by r2wc to the element itself; not a viewer prop. */
  container?: HTMLElement;
};

// r2wc hands every event a dispatcher whether anyone listens or not, so
// `onClickCenter` is always set. The React component renders its center
// button only when that prop is given, so it is passed through on request.
function ComicViewerForElement({
  centerAction,
  container: _container,
  onClickCenter,
  ...props
}: ComicViewerElementProps) {
  return (
    <ComicViewer
      {...props}
      onClickCenter={centerAction ? onClickCenter : undefined}
    />
  );
}

// Built by scripts/build.mjs into a single file that carries its own runtime:
// `react` is aliased to Preact there, so pages without React can load it with
// one script tag. Callbacks become DOM events named after the prop, without
// `on` and lowercased, carrying the argument in `detail`.
const ComicViewerElement = r2wc(ComicViewerForElement, {
  events: [
    "onChangeCurrentPage",
    "onChangeExpansion",
    "onClickCenter",
    "onTryMoveNextPage",
    "onTryMovePrevPage",
  ],
  props: {
    centerAction: "boolean",
    className: "json",
    currentPage: "number",
    direction: "string",
    initialCurrentPage: "number",
    initialIsExpansion: "boolean",
    isExpansion: "boolean",
    pages: "json",
    showPageIndicator: "boolean",
    switchingRatio: "number",
    text: "json",
  },
});

// A page that loads the script twice would otherwise throw on the second
// `define`.
if (!customElements.get("comic-viewer")) {
  customElements.define("comic-viewer", ComicViewerElement);
}

export { ComicViewerElement };
