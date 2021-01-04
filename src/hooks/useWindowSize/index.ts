import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import useEventListener from "@use-it/event-listener";

export type WindowSize = {
  windowHeight: number;
  windowWidth: number;
};

const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    windowHeight: 0,
    windowWidth: 0,
  });
  const debounced = useDebouncedCallback(() => {
    setWindowSize({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });
  }, 100);
  useEventListener("resize", debounced.callback);

  useEffect(() => {
    debounced.callback();
  }, [debounced]);

  return windowSize;
};

export default useWindowSize;
