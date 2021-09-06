import { ComponentPropsWithoutRef, ReactNode, useMemo } from "react";
import { useWindowHeight } from "@react-hook/window-size";

export type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps): JSX.Element {
  const onlyHeight = useWindowHeight();
  const style = useMemo<ComponentPropsWithoutRef<"div">["style"]>(
    () => ({
      minHeight: onlyHeight,
    }),
    [onlyHeight]
  );

  return <div style={style}>{children}</div>;
}

export default Layout;
