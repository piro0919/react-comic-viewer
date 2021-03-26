import { ComponentPropsWithoutRef, FC, useMemo } from "react";
import useWindowSize from "@rooks/use-window-size";

const Layout: FC = ({ children }) => {
  const { innerHeight } = useWindowSize();
  const style = useMemo<ComponentPropsWithoutRef<"div">["style"]>(
    () => ({
      minHeight: innerHeight || 0,
    }),
    [innerHeight]
  );

  return <div style={style}>{children}</div>;
};

export default Layout;
