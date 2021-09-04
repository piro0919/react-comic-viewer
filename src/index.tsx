import React, {
  ComponentPropsWithoutRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CloseButton,
  ControlButton,
  Controller,
  Img,
  ImgProps,
  MainController,
  NavigationButton,
  Page,
  PageProps,
  PagesWrapper,
  PagesWrapperProps,
  RangeInput,
  ScaleController,
  SubController,
  Viewer,
  Wrapper,
  WrapperProps,
} from "./style";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { nanoid } from "nanoid";
import {
  BiChevronLeft,
  BiChevronRight,
  BiCollapse,
  BiExpand,
  BiFullscreen,
  BiMoveHorizontal,
} from "react-icons/bi";
import useOutsideClickRef from "@rooks/use-outside-click-ref";
import { CgClose } from "react-icons/cg";
import { useSwipeable } from "react-swipeable";
import { useWindowSize } from "@react-hook/window-size";
import useDidUpdate from "@rooks/use-did-update";

export type ComicViewerProps = {
  direction?: "ltr" | "rtl";
  initialCurrentPage?: number;
  initialIsExpansion?: boolean;
  onChangeCurrentPage?: (currentPage: number) => void;
  onChangeExpansion?: (isExpansion: boolean) => void;
  pages: Array<string | ReactNode>;
  switchingRatio?: number;
  text?: Record<"expansion" | "fullScreen" | "move" | "normal", string>;
};

function ComicViewer({
  direction = "rtl",
  initialCurrentPage = 0,
  initialIsExpansion = false,
  onChangeCurrentPage,
  onChangeExpansion,
  pages: pagesProp,
  switchingRatio = 1,
  text = {
    expansion: "Expansion",
    fullScreen: "Full screen",
    move: "Move",
    normal: "Normal",
  },
}: ComicViewerProps): JSX.Element {
  const isRightToLeft = useMemo(() => direction === "rtl", [direction]);
  const {
    expansion: expansionText,
    fullScreen,
    move,
    normal,
  } = useMemo(() => text, [text]);
  const [width, height] = useWindowSize();
  const [isExpansion, setIsExpansion] =
    useState<WrapperProps["isExpansion"]>(initialIsExpansion);
  const [switchingFullScreen, setSwitchingFullScreen] =
    useState<PagesWrapperProps["switchingFullScreen"]>(false);
  const handle = useFullScreenHandle();
  const { active, enter, exit } = useMemo(() => handle, [handle]);
  const handleClickOnExpansion = useCallback<
    NonNullable<ComponentPropsWithoutRef<"button">["onClick"]>
  >(() => {
    setIsExpansion((prevIsExpansion) => !prevIsExpansion);
  }, []);
  const handleClickOnFullScreen = useCallback<
    NonNullable<ComponentPropsWithoutRef<"button">["onClick"]>
  >(() => {
    setSwitchingFullScreen(true);

    enter();
  }, [enter]);
  const handleClickOnClose = useCallback<
    NonNullable<ComponentPropsWithoutRef<"button">["onClick"]>
  >(() => {
    setSwitchingFullScreen(true);

    exit();
  }, [exit]);
  const pageWidth = useMemo<PageProps["width"]>(
    () => (height > width * switchingRatio ? width : width / 2),
    [switchingRatio, height, width]
  );
  const expansion = useMemo<ComponentPropsWithoutRef<"button">["children"]>(
    () => (isExpansion ? normal : expansionText),
    [expansionText, isExpansion, normal]
  );
  const expansionIcon = useMemo(
    () =>
      isExpansion ? (
        <BiCollapse color="#fff" size={24} />
      ) : (
        <BiExpand color="#fff" size={24} />
      ),
    [isExpansion]
  );
  const isSingleView = useMemo<ImgProps["isSingleView"]>(
    () => height > width * switchingRatio,
    [switchingRatio, height, width]
  );
  const pages = useMemo(() => {
    if (isRightToLeft) {
      return pagesProp;
    }

    const reversePages = pagesProp.slice().reverse();

    if (isSingleView || reversePages.length % 2 === 0) {
      return reversePages;
    }

    return [null, ...reversePages];
  }, [isRightToLeft, isSingleView, pagesProp]);
  const items = useMemo(
    () =>
      pages.map((page, index) => (
        <Page key={nanoid()} width={pageWidth}>
          {typeof page === "string" ? (
            <Img
              alt={page}
              isOdd={!(index % 2)}
              isSingleView={isSingleView}
              src={page}
            />
          ) : (
            page
          )}
        </Page>
      )),
    [isSingleView, pageWidth, pages]
  );
  const [prevIsExpansion, setPrevIsExpansion] = useState<
    typeof isExpansion | undefined
  >();
  const [currentPage, setCurrentPage] = useState(() => {
    const currentPage = isRightToLeft
      ? initialCurrentPage
      : pages.length - initialCurrentPage - 1;

    return isSingleView ? currentPage : Math.floor(currentPage / 2) * 2;
  });
  const disabledNextPage = useMemo(
    () =>
      (isSingleView && currentPage >= pages.length - 1) ||
      (!isSingleView && currentPage >= pages.length - 2),
    [currentPage, isSingleView, pages.length]
  );
  const handleClickOnNextPage = useCallback<
    NonNullable<ComponentPropsWithoutRef<"a">["onClick"]>
  >(() => {
    if (disabledNextPage) {
      return;
    }

    setSwitchingFullScreen(false);
    setCurrentPage(
      (prevCurrentPage) => prevCurrentPage + (isSingleView ? 1 : 2)
    );
  }, [disabledNextPage, isSingleView]);
  const disabledPrevPage = useMemo(() => currentPage === 0, [currentPage]);
  const handleClickOnPrevPage = useCallback<
    NonNullable<ComponentPropsWithoutRef<"a">["onClick"]>
  >(() => {
    if (disabledPrevPage) {
      return;
    }

    setSwitchingFullScreen(false);
    setCurrentPage(
      (prevCurrentPage) => prevCurrentPage - (isSingleView ? 1 : 2)
    );
  }, [disabledPrevPage, isSingleView]);
  const [showMove, setShowMove] = useState(false);
  const handleClickOnShowMove = useCallback<
    NonNullable<ComponentPropsWithoutRef<"button">["onClick"]>
  >(() => {
    setShowMove(true);
  }, []);
  const handleChange = useCallback<
    NonNullable<ComponentPropsWithoutRef<"input">["onChange"]>
  >(
    ({ currentTarget: { value } }) => {
      setSwitchingFullScreen(false);
      setCurrentPage(
        isSingleView ? parseInt(value, 10) - 1 : (parseInt(value, 10) - 1) * 2
      );
    },
    [isSingleView]
  );
  const handleClickOnOutside = useCallback(() => {
    setShowMove(false);
  }, []);
  const [ref] = useOutsideClickRef(handleClickOnOutside);
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (disabledPrevPage) {
        return;
      }

      setSwitchingFullScreen(false);
      setCurrentPage(
        (prevCurrentPage) => prevCurrentPage - (isSingleView ? 1 : 2)
      );
    },
    onSwipedRight: () => {
      if (disabledNextPage) {
        return;
      }

      setSwitchingFullScreen(false);
      setCurrentPage(
        (prevCurrentPage) => prevCurrentPage + (isSingleView ? 1 : 2)
      );
    },
  });

  useEffect(() => {
    if (!active) {
      if (typeof prevIsExpansion !== "boolean") {
        return;
      }

      setPrevIsExpansion(undefined);
      setIsExpansion(prevIsExpansion);

      return;
    }

    if (typeof prevIsExpansion === "boolean") {
      return;
    }

    setPrevIsExpansion(isExpansion);
    setIsExpansion(true);
  }, [active, isExpansion, prevIsExpansion]);

  useDidUpdate(() => {
    if (isSingleView) {
      if (isRightToLeft) {
        return;
      }

      setCurrentPage(
        (prevCurrentPage) =>
          Math.floor(prevCurrentPage / 2) * 2 +
          (pagesProp.length % 2 === 0 ? 1 : 0)
      );

      return;
    }

    setCurrentPage(
      (prevCurrentPage) =>
        (isRightToLeft || pagesProp.length % 2 === 0
          ? Math.floor(prevCurrentPage / 2)
          : Math.ceil(prevCurrentPage / 2)) * 2
    );
  }, [isRightToLeft, isSingleView, pagesProp.length]);

  useDidUpdate(() => {
    if (!onChangeCurrentPage) {
      return;
    }

    onChangeCurrentPage(
      isRightToLeft
        ? currentPage
        : pages.length - currentPage - (isSingleView ? 1 : 2)
    );
  }, [currentPage, onChangeCurrentPage]);

  useDidUpdate(() => {
    if (!onChangeExpansion) {
      return;
    }

    onChangeExpansion(isExpansion);
  }, [isExpansion, onChangeExpansion]);

  return (
    <FullScreen handle={handle}>
      <Wrapper
        height={height}
        isExpansion={isExpansion}
        isFullScreen={active}
        {...handlers}
      >
        <Viewer>
          <PagesWrapper
            currentPage={currentPage}
            pageWidth={pageWidth}
            switchingFullScreen={switchingFullScreen}
          >
            {items}
          </PagesWrapper>
          {disabledNextPage ? null : (
            <NavigationButton navigation="next" onClick={handleClickOnNextPage}>
              <BiChevronLeft color="#888" size={64} />
            </NavigationButton>
          )}
          {disabledPrevPage ? null : (
            <NavigationButton navigation="prev" onClick={handleClickOnPrevPage}>
              <BiChevronRight color="#888" size={64} />
            </NavigationButton>
          )}
        </Viewer>
        {active ? (
          <CloseButton onClick={handleClickOnClose}>
            <CgClose color="#fff" size={36} />
          </CloseButton>
        ) : (
          <Controller>
            {showMove ? (
              <SubController ref={ref}>
                <RangeInput
                  onChange={handleChange}
                  max={
                    isSingleView ? pages.length : Math.ceil(pages.length / 2)
                  }
                  min={1}
                  step={1}
                  type="range"
                  value={
                    isSingleView
                      ? currentPage + 1
                      : Math.floor(currentPage / 2) + 1
                  }
                />
              </SubController>
            ) : (
              <MainController>
                <ScaleController>
                  <ControlButton onClick={handleClickOnExpansion}>
                    {expansionIcon}
                    {expansion}
                  </ControlButton>
                  <ControlButton onClick={handleClickOnFullScreen}>
                    <BiFullscreen color="#fff" size={24} />
                    {fullScreen}
                  </ControlButton>
                </ScaleController>
                <ControlButton onClick={handleClickOnShowMove}>
                  <BiMoveHorizontal color="#fff" size={24} />
                  {move}
                </ControlButton>
              </MainController>
            )}
          </Controller>
        )}
      </Wrapper>
    </FullScreen>
  );
}

function NoSSRComicViewer(props: ComicViewerProps): JSX.Element | null {
  return typeof window !== "undefined" ? <ComicViewer {...props} /> : null;
}

export default NoSSRComicViewer;
