import React, {
  ComponentPropsWithoutRef,
  FC,
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
import uniqid from "uniqid";
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
import useWindowSize from "@rooks/use-window-size";
import useDidUpdate from "@rooks/use-did-update";
import NoSSR from "@mpth/react-no-ssr";

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

const ComicViewer: FC<ComicViewerProps> = ({
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
}: ComicViewerProps) => {
  const pages = useMemo(() => {
    if (direction === "rtl") {
      return pagesProp;
    }

    const reversePages = pagesProp.slice().reverse();

    return reversePages.length % 2 ? [null, ...reversePages] : reversePages;
  }, [direction, pagesProp]);
  const {
    expansion: expansionText,
    fullScreen,
    move,
    normal,
  } = useMemo(() => text, [text]);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const { innerHeight, innerWidth } = useWindowSize();
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
    () =>
      windowHeight > windowWidth * switchingRatio
        ? windowWidth
        : windowWidth / 2,
    [switchingRatio, windowHeight, windowWidth]
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
    () => windowHeight > windowWidth * switchingRatio,
    [switchingRatio, windowHeight, windowWidth]
  );
  const items = useMemo(
    () =>
      pages.map((page, index) => (
        <Page key={uniqid()} width={pageWidth}>
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
  const [currentPage, setCurrentPage] = useState(
    direction === "rtl"
      ? initialCurrentPage
      : pages.length - initialCurrentPage - 1
  );
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

  useEffect(() => {
    if (isSingleView) {
      return;
    }

    setCurrentPage((prevCurrentPage) => Math.floor(prevCurrentPage / 2) * 2);
  }, [isSingleView]);

  useEffect(() => {
    if (typeof innerHeight !== "number") {
      return;
    }

    setWindowHeight(innerHeight);
  }, [innerHeight]);

  useEffect(() => {
    if (typeof innerWidth !== "number") {
      return;
    }

    setWindowWidth(innerWidth);
  }, [innerWidth]);

  useDidUpdate(() => {
    if (!onChangeCurrentPage) {
      return;
    }

    onChangeCurrentPage(currentPage);
  }, [currentPage, onChangeCurrentPage]);

  useDidUpdate(() => {
    if (!onChangeExpansion) {
      return;
    }

    onChangeExpansion(isExpansion);
  }, [isExpansion, onChangeExpansion]);

  return (
    <NoSSR>
      <FullScreen handle={handle}>
        <Wrapper
          height={windowHeight}
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
              <NavigationButton
                navigation="next"
                onClick={handleClickOnNextPage}
              >
                <BiChevronLeft color="#888" size={64} />
              </NavigationButton>
            )}
            {disabledPrevPage ? null : (
              <NavigationButton
                navigation="prev"
                onClick={handleClickOnPrevPage}
              >
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
    </NoSSR>
  );
};

export default ComicViewer;
