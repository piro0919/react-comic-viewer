import useWindowSize from "./hooks/useWindowSize";
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
  BiExpand,
  BiFullscreen,
  BiMoveHorizontal,
} from "react-icons/bi";
import useOutsideClickRef from "@rooks/use-outside-click-ref";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { CgClose } from "react-icons/cg";
import { useSwipeable } from "react-swipeable";

export type ComicViewerProps = {
  pages: Array<string | ReactNode>;
  switchingRatio?: number;
};

const ComicViewer: FC<ComicViewerProps> = ({ pages, switchingRatio = 1 }) => {
  const { windowHeight, windowWidth } = useWindowSize();
  const [isExpansion, setIsExpansion] = useState<WrapperProps["isExpansion"]>(
    false
  );
  const handle = useFullScreenHandle();
  const { active, enter, exit } = useMemo(
    () => ({
      ...handle,
    }),
    [handle]
  );
  const handleClickOnExpansion = useCallback<
    NonNullable<ComponentPropsWithoutRef<"button">["onClick"]>
  >(() => {
    setIsExpansion((prevIsExpansion) => !prevIsExpansion);
  }, []);
  const handleClickOnFullScreen = useCallback<
    NonNullable<ComponentPropsWithoutRef<"button">["onClick"]>
  >(() => {
    enter();
  }, [enter]);
  const handleClickOnClose = useCallback<
    NonNullable<ComponentPropsWithoutRef<"button">["onClick"]>
  >(() => {
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
    () => (isExpansion ? "通常" : "拡大"),
    [isExpansion]
  );
  const fullScreen = useMemo<ComponentPropsWithoutRef<"button">["children"]>(
    () => (active ? "戻る" : "全画面"),
    [active]
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
            <LazyLoadComponent threshold={0}>
              <Img
                alt={page}
                isOdd={!(index % 2)}
                isSingleView={isSingleView}
                src={page}
              />
            </LazyLoadComponent>
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
  const [currentPage, setCurrentPage] = useState(0);
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

      setCurrentPage(
        (prevCurrentPage) => prevCurrentPage - (isSingleView ? 1 : 2)
      );
    },
    onSwipedRight: () => {
      if (disabledNextPage) {
        return;
      }

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

  return (
    <FullScreen handle={handle}>
      <Wrapper
        height={windowHeight}
        isExpansion={isExpansion}
        isFullScreen={active}
        {...handlers}
      >
        <Viewer>
          <PagesWrapper currentPage={currentPage} pageWidth={pageWidth}>
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
                    <BiExpand color="#fff" size={24} />
                    {expansion}
                  </ControlButton>
                  <ControlButton onClick={handleClickOnFullScreen}>
                    <BiFullscreen color="#fff" size={24} />
                    {fullScreen}
                  </ControlButton>
                </ScaleController>
                <ControlButton onClick={handleClickOnShowMove}>
                  <BiMoveHorizontal color="#fff" size={24} />
                  移動
                </ControlButton>
              </MainController>
            )}
          </Controller>
        )}
      </Wrapper>
    </FullScreen>
  );
};

export default ComicViewer;
