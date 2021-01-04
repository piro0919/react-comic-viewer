import { ComponentPropsWithoutRef, FC, useMemo } from "react";
import useWindowSize from "hooks/useWindowSize";

const Layout: FC = ({ children }) => {
  const { windowHeight } = useWindowSize();
  const style = useMemo<ComponentPropsWithoutRef<"div">["style"]>(
    () => ({
      minHeight: windowHeight,
    }),
    [windowHeight]
  );

  return <div style={style}>{children}</div>;
};

export default Layout;
