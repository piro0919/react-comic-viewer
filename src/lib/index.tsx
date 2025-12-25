import {
  type MouseEventHandler,
  type ReactNode,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BiChevronLeft,
  BiChevronRight,
  BiCollapse,
  BiExpand,
  BiFullscreen,
  BiGridAlt,
  BiMoveHorizontal,
} from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { useSwipeable } from "react-swipeable";
import { useWindowSize, useOnClickOutside } from "usehooks-ts";
import screenfull from "screenfull";
import styles from "./ComicViewer.module.css";

function PageImage({
  src,
  className,
  errorClassName,
  loadingClassName,
}: {
  src: string;
  className: string;
  errorClassName: string;
  loadingClassName: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (_: SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return <div className={errorClassName}>Failed to load image</div>;
  }

  return (
    <>
      {isLoading && (
        <div className={loadingClassName}>
          <div className={styles.spinner} />
        </div>
      )}
      <img
        src={src}
        alt=""
        className={className}
        style={{ opacity: isLoading ? 0 : 1 }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
}

export type ComicViewerProps = {
  className?: Partial<Record<string, string>>;
  direction?: "ltr" | "rtl";
  initialCurrentPage?: number;
  initialIsExpansion?: boolean;
  onChangeCurrentPage?: (currentPage: number) => void;
  onChangeExpansion?: (isExpansion: boolean) => void;
  onClickCenter?: MouseEventHandler<HTMLButtonElement>;
  pages: Array<string | ReactNode>;
  showPageIndicator?: boolean;
  switchingRatio?: number;
  text?: {
    expansion?: string;
    fullScreen?: string;
    move?: string;
    normal?: string;
    thumbnails?: string;
  };
};

export function ComicViewer({
  className,
  direction = "rtl",
  initialCurrentPage = 0,
  initialIsExpansion = false,
  onChangeCurrentPage,
  onChangeExpansion,
  onClickCenter,
  pages: pagesProp,
  showPageIndicator = false,
  switchingRatio = 1,
  text = {},
}: ComicViewerProps): JSX.Element {
  const {
    expansion: expansionText = "Expansion",
    fullScreen: fullScreenText = "Full screen",
    move: moveText = "Move",
    normal: normalText = "Normal",
    thumbnails: thumbnailsText = "Thumbnails",
  } = text;

  const isRtl = direction === "rtl";
  const { width, height } = useWindowSize();
  const isSingleView = height > width * switchingRatio;
  const pageWidth = isSingleView ? width : width / 2;

  // State
  const [isExpansion, setIsExpansion] = useState(initialIsExpansion);
  const [currentPage, setCurrentPage] = useState(() =>
    isSingleView ? initialCurrentPage : Math.floor(initialCurrentPage / 2) * 2
  );
  const [showMove, setShowMove] = useState(false);
  const [switchingFullScreen, setSwitchingFullScreen] = useState(false);
  const [prevIsExpansion, setPrevIsExpansion] = useState<boolean | undefined>();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showThumbnails, setShowThumbnails] = useState(false);

  // Refs
  const isFirstRenderForPage = useRef(true);
  const isFirstRenderForExpansion = useRef(true);
  const prevIsSingleView = useRef(isSingleView);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Fullscreen handlers
  const enterFullScreen = useCallback(() => {
    if (screenfull.isEnabled && wrapperRef.current) {
      screenfull.request(wrapperRef.current);
    }
  }, []);

  const exitFullScreen = useCallback(() => {
    if (screenfull.isEnabled) {
      screenfull.exit();
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    if (!screenfull.isEnabled) return;

    const handleChange = () => {
      setIsFullScreen(screenfull.isFullscreen);
    };

    screenfull.on("change", handleChange);
    return () => {
      screenfull.off("change", handleChange);
    };
  }, []);

  // Pages
  const pages = useMemo(() => {
    if (isRtl) return pagesProp;
    const reversed = [...pagesProp].reverse();
    if (isSingleView || reversed.length % 2 === 0) return reversed;
    return [null, ...reversed];
  }, [isRtl, pagesProp, isSingleView]);

  // Navigation
  const canGoNext = isSingleView
    ? currentPage < pages.length - 1
    : currentPage < pages.length - 2;
  const canGoPrev = currentPage > 0;
  const step = isSingleView ? 1 : 2;

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    setSwitchingFullScreen(false);
    setCurrentPage((prev) => prev + step);
  }, [canGoNext, step]);

  const goPrev = useCallback(() => {
    if (!canGoPrev) return;
    setSwitchingFullScreen(false);
    setCurrentPage((prev) => prev - step);
  }, [canGoPrev, step]);

  // Swipe handlers (RTL: left=prev, right=next / LTR: left=next, right=prev)
  const { ref: swipeRef, ...swipeHandlers } = useSwipeable({
    onSwipedLeft: isZoomed ? undefined : isRtl ? goPrev : goNext,
    onSwipedRight: isZoomed ? undefined : isRtl ? goNext : goPrev,
    onTap: ({ event }) => {
      const now = Date.now();
      const touch = (event as TouchEvent).changedTouches?.[0];
      const clientX = touch?.clientX ?? (event as MouseEvent).clientX;
      const clientY = touch?.clientY ?? (event as MouseEvent).clientY;

      const lastTap = lastTapRef.current;
      const isDoubleTap =
        lastTap &&
        now - lastTap.time < 300 &&
        Math.abs(clientX - lastTap.x) < 30 &&
        Math.abs(clientY - lastTap.y) < 30;

      if (isDoubleTap) {
        // Double tap: toggle zoom
        lastTapRef.current = null;
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          const rect = wrapperRef.current?.getBoundingClientRect();
          if (rect) {
            const x = ((clientX - rect.left) / rect.width) * 100;
            const y = ((clientY - rect.top) / rect.height) * 100;
            setZoomPosition({ x, y });
          }
          setIsZoomed(true);
          setShowUI(false);
        }
      } else {
        // Single tap: toggle UI (with delay to check for double tap)
        lastTapRef.current = { time: now, x: clientX, y: clientY };
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          setShowUI((prev) => !prev);
        }
      }
    },
  });

  // Outside click for move slider and thumbnails
  const moveSliderRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(moveSliderRef, () => setShowMove(false));
  useOnClickOutside(thumbnailsRef, () => setShowThumbnails(false));

  // Handle range input
  const handleRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setSwitchingFullScreen(false);
      setCurrentPage(isSingleView ? value - 1 : (value - 1) * 2);
    },
    [isSingleView]
  );

  // Handle thumbnail click
  const handleThumbnailClick = useCallback(
    (index: number) => {
      setSwitchingFullScreen(false);
      setCurrentPage(isSingleView ? index : Math.floor(index / 2) * 2);
      setShowThumbnails(false);
    },
    [isSingleView]
  );

  // Fullscreen sync for expansion state
  useEffect(() => {
    if (!isFullScreen) {
      if (typeof prevIsExpansion === "boolean") {
        setIsExpansion(prevIsExpansion);
        setPrevIsExpansion(undefined);
      }
    } else if (prevIsExpansion === undefined) {
      setPrevIsExpansion(isExpansion);
      setIsExpansion(true);
    }
  }, [isFullScreen, isExpansion, prevIsExpansion]);

  // Adjust currentPage when switching between single/double view
  useEffect(() => {
    if (prevIsSingleView.current !== isSingleView && !isSingleView) {
      setCurrentPage((prev) => Math.floor(prev / 2) * 2);
    }
    prevIsSingleView.current = isSingleView;
  }, [isSingleView]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        isRtl ? goNext() : goPrev();
      } else if (e.key === "ArrowRight") {
        isRtl ? goPrev() : goNext();
      } else if (e.key === "Escape" && isFullScreen) {
        exitFullScreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRtl, goNext, goPrev, isFullScreen, exitFullScreen]);

  // Preload adjacent pages
  useEffect(() => {
    const preloadPage = (index: number) => {
      const page = pages[index];
      if (typeof page === "string") {
        const img = new Image();
        img.src = page;
      }
    };

    // Preload next pages
    if (isSingleView) {
      if (currentPage + 1 < pages.length) preloadPage(currentPage + 1);
      if (currentPage + 2 < pages.length) preloadPage(currentPage + 2);
    } else {
      if (currentPage + 2 < pages.length) preloadPage(currentPage + 2);
      if (currentPage + 3 < pages.length) preloadPage(currentPage + 3);
    }
  }, [currentPage, pages, isSingleView]);

  // Reset zoom when page changes
  useEffect(() => {
    setIsZoomed(false);
  }, [currentPage]);

  // Callbacks for page/expansion changes (skip first render)
  useEffect(() => {
    if (isFirstRenderForPage.current) {
      isFirstRenderForPage.current = false;
      return;
    }
    onChangeCurrentPage?.(currentPage);
  }, [currentPage, onChangeCurrentPage]);

  useEffect(() => {
    if (isFirstRenderForExpansion.current) {
      isFirstRenderForExpansion.current = false;
      return;
    }
    onChangeExpansion?.(isExpansion);
  }, [isExpansion, onChangeExpansion]);

  // Computed values
  const rangeMax = isSingleView ? pages.length : Math.ceil(pages.length / 2);
  const rangeValue = isSingleView
    ? currentPage + 1
    : Math.floor(currentPage / 2) + 1;

  const hideController = isFullScreen || !showUI;
  const wrapperStyle: React.CSSProperties = {
    gridTemplate: `1fr ${hideController ? "0" : "40px"} / 1fr`,
    height: isFullScreen ? "100vh" : `${height - (isExpansion ? 0 : 95)}px`,
    maxHeight: isFullScreen ? "100vh" : `${isExpansion ? height : 840}px`,
    minHeight: isFullScreen ? "100vh" : `${isExpansion ? 0 : 440}px`,
  };

  const pagesWrapperStyle: React.CSSProperties = {
    transform: isZoomed
      ? `scale(2) translateX(${
          isRtl
            ? currentPage * pageWidth
            : (pages.length - (isSingleView ? 1 : 2) - currentPage) * pageWidth
        }px)`
      : `translateX(${
          isRtl
            ? currentPage * pageWidth
            : (pages.length - (isSingleView ? 1 : 2) - currentPage) * pageWidth
        }px)`,
    transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : "center",
    transition: switchingFullScreen ? "0ms" : "250ms",
  };

  return (
    <div
      ref={(el) => {
        wrapperRef.current = el;
        swipeRef(el);
      }}
      className={`${styles.wrapper} ${className?.wrapper ?? ""}`}
      style={wrapperStyle}
      {...swipeHandlers}
    >
      <div className={`${styles.viewer} ${className?.viewer ?? ""}`}>
        <div
          className={`${styles.pagesWrapper} ${className?.pagesWrapper ?? ""}`}
          style={pagesWrapperStyle}
        >
          {pages.map((page, index) => (
            <div
              key={index}
              className={`${styles.page} ${className?.page ?? ""}`}
              style={{ width: pageWidth }}
            >
              {typeof page === "string" ? (
                <PageImage
                  src={page}
                  className={`${styles.img} ${
                    isSingleView
                      ? styles.imgSingle
                      : index % 2 === 0
                      ? styles.imgOdd
                      : styles.imgEven
                  } ${className?.img ?? ""}`}
                  errorClassName={styles.imgError}
                  loadingClassName={styles.imgLoading}
                />
              ) : (
                page
              )}
            </div>
          ))}
        </div>

        {canGoNext && (
          <button
            type="button"
            aria-label="Next page"
            className={`${styles.navigationButton} ${
              isRtl
                ? styles.navigationButtonNext
                : styles.navigationButtonNextLtr
            } ${className?.nextNavigationButton ?? ""}`}
            onClick={goNext}
          >
            {isRtl ? (
              <BiChevronLeft color="#888" size={64} />
            ) : (
              <BiChevronRight color="#888" size={64} />
            )}
          </button>
        )}

        {onClickCenter && (
          <button
            type="button"
            aria-label="Center action"
            className={`${styles.centerButton} ${
              className?.centerButton ?? ""
            }`}
            onClick={onClickCenter}
          />
        )}

        {canGoPrev && (
          <button
            type="button"
            aria-label="Previous page"
            className={`${styles.navigationButton} ${
              isRtl
                ? styles.navigationButtonPrev
                : styles.navigationButtonPrevLtr
            } ${className?.prevNavigationButton ?? ""}`}
            onClick={goPrev}
          >
            {isRtl ? (
              <BiChevronRight color="#888" size={64} />
            ) : (
              <BiChevronLeft color="#888" size={64} />
            )}
          </button>
        )}

        {showPageIndicator && showUI && (
          <div
            className={`${styles.pageIndicator} ${
              className?.pageIndicator ?? ""
            }`}
          >
            {rangeValue} / {rangeMax}
          </div>
        )}
      </div>

      {isFullScreen ? (
        showUI && (
          <button
            className={`${styles.closeButton} ${className?.closeButton ?? ""}`}
            onClick={() => {
              setSwitchingFullScreen(true);
              exitFullScreen();
            }}
          >
            <CgClose color="#fff" size={36} />
          </button>
        )
      ) : (
        showUI && (
          <aside
            className={`${styles.controller} ${className?.controller ?? ""}`}
          >
            {showMove ? (
              <div
                ref={moveSliderRef}
                className={`${styles.subController} ${
                  className?.subController ?? ""
                }`}
              >
                <input
                  type="range"
                  min={1}
                  max={rangeMax}
                  step={1}
                  value={rangeValue}
                  onChange={handleRangeChange}
                  className={`${styles.rangeInput} ${
                    isRtl ? styles.rangeInputRtl : ""
                  } ${className?.rangeInput ?? ""}`}
                />
              </div>
            ) : (
              <div
                className={`${styles.mainController} ${
                  className?.mainController ?? ""
                }`}
              >
                <div
                  className={`${styles.scaleController} ${
                    className?.scaleController ?? ""
                  }`}
                >
                  <button
                    className={`${styles.controlButton} ${
                      className?.expansionControlButton ?? ""
                    }`}
                    onClick={() => setIsExpansion((prev) => !prev)}
                  >
                    {isExpansion ? (
                      <BiCollapse color="#fff" size={24} />
                    ) : (
                      <BiExpand color="#fff" size={24} />
                    )}
                    {isExpansion ? normalText : expansionText}
                  </button>

                  {screenfull.isEnabled && (
                    <button
                      className={`${styles.controlButton} ${
                        className?.fullScreenControlButton ?? ""
                      }`}
                      onClick={() => {
                        setSwitchingFullScreen(true);
                        enterFullScreen();
                      }}
                    >
                      <BiFullscreen color="#fff" size={24} />
                      {fullScreenText}
                    </button>
                  )}
                </div>

                <div
                  className={`${styles.scaleController} ${
                    className?.scaleController ?? ""
                  }`}
                >
                  <button
                    className={`${styles.controlButton} ${
                      className?.showMoveControlButton ?? ""
                    }`}
                    onClick={() => setShowMove(true)}
                  >
                    <BiMoveHorizontal color="#fff" size={24} />
                    {moveText}
                  </button>

                  <button
                    className={`${styles.controlButton} ${
                      className?.thumbnailsControlButton ?? ""
                    }`}
                    onClick={() => setShowThumbnails(true)}
                  >
                    <BiGridAlt color="#fff" size={24} />
                    {thumbnailsText}
                  </button>
                </div>
              </div>
            )}
          </aside>
        )
      )}

      {showThumbnails && (
        <div className={styles.thumbnailsOverlay}>
          <div
            ref={thumbnailsRef}
            className={`${styles.thumbnailsContainer} ${
              className?.thumbnailsContainer ?? ""
            }`}
          >
            <div className={styles.thumbnailsHeader}>
              <span>{thumbnailsText}</span>
              <button
                className={styles.thumbnailsCloseButton}
                onClick={() => setShowThumbnails(false)}
              >
                <CgClose color="#fff" size={24} />
              </button>
            </div>
            <div className={styles.thumbnailsGrid}>
              {pagesProp.map((page, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnailItem} ${
                    (isSingleView ? index === currentPage : Math.floor(index / 2) * 2 === currentPage)
                      ? styles.thumbnailItemActive
                      : ""
                  } ${className?.thumbnailItem ?? ""}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  {typeof page === "string" ? (
                    <img src={page} alt={`Page ${index + 1}`} className={styles.thumbnailImage} />
                  ) : (
                    <div className={styles.thumbnailPlaceholder}>{index + 1}</div>
                  )}
                  <span className={styles.thumbnailNumber}>{index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComicViewer;
