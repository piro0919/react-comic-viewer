import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ComicViewer } from "../src/lib";

const PAGES = ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"];

/** jsdom reports 1024x768, so the viewer opens as a spread by default. */
const SINGLE = { switchingRatio: 0.5 };

describe("ComicViewer", () => {
  it("renders every page it is given", () => {
    const { container } = render(<ComicViewer pages={PAGES} />);
    expect(container.querySelectorAll("img")).toHaveLength(PAGES.length);
  });

  it("has nowhere to go back to on the first page", () => {
    render(<ComicViewer pages={PAGES} />);
    expect(screen.queryByLabelText("Previous page")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Next page")).toBeInTheDocument();
  });

  it("turns two pages at a time in a spread", async () => {
    const user = userEvent.setup();
    const onChangeCurrentPage = vi.fn();
    render(
      <ComicViewer pages={PAGES} onChangeCurrentPage={onChangeCurrentPage} />,
    );

    await user.click(screen.getByLabelText("Next page"));
    expect(onChangeCurrentPage).toHaveBeenCalledWith(2);
  });

  it("turns one page at a time when the window is tall enough for a single view", async () => {
    const user = userEvent.setup();
    const onChangeCurrentPage = vi.fn();
    render(
      <ComicViewer
        pages={PAGES}
        {...SINGLE}
        onChangeCurrentPage={onChangeCurrentPage}
      />,
    );

    await user.click(screen.getByLabelText("Next page"));
    expect(onChangeCurrentPage).toHaveBeenCalledWith(1);
  });

  it("offers a way back once it has moved off the first page", async () => {
    const user = userEvent.setup();
    render(<ComicViewer pages={PAGES} {...SINGLE} />);

    await user.click(screen.getByLabelText("Next page"));
    expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
  });

  it("stops offering to move forward at the last page", async () => {
    const user = userEvent.setup();
    render(<ComicViewer pages={["/1.jpg", "/2.jpg"]} {...SINGLE} />);

    await user.click(screen.getByLabelText("Next page"));
    expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
  });

  it("announces the move before making it", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(
      <ComicViewer
        pages={PAGES}
        {...SINGLE}
        onTryMoveNextPage={() => calls.push("try")}
        onChangeCurrentPage={() => calls.push("change")}
      />,
    );

    await user.click(screen.getByLabelText("Next page"));
    expect(calls).toEqual(["try", "change"]);
  });

  it("leaves the page where the parent put it when the page is controlled", async () => {
    const user = userEvent.setup();
    const onChangeCurrentPage = vi.fn();
    render(
      <ComicViewer
        pages={PAGES}
        {...SINGLE}
        currentPage={0}
        onChangeCurrentPage={onChangeCurrentPage}
      />,
    );

    // The parent ignores the request, so the viewer must not move on its own —
    // a "Previous page" control appearing would mean it did.
    await user.click(screen.getByLabelText("Next page"));
    expect(onChangeCurrentPage).toHaveBeenCalledWith(1);
    expect(screen.queryByLabelText("Previous page")).not.toBeInTheDocument();
  });

  it("starts where initialCurrentPage says in a single view", async () => {
    const user = userEvent.setup();
    const onChangeCurrentPage = vi.fn();
    render(
      <ComicViewer
        pages={PAGES}
        {...SINGLE}
        initialCurrentPage={1}
        onChangeCurrentPage={onChangeCurrentPage}
      />,
    );

    await user.click(screen.getByLabelText("Next page"));
    expect(onChangeCurrentPage).toHaveBeenCalledWith(2);
  });

  it("snaps an odd starting page down to the left half of a spread", async () => {
    const user = userEvent.setup();
    const onChangeCurrentPage = vi.fn();
    render(
      <ComicViewer
        pages={[...PAGES, "/5.jpg", "/6.jpg"]}
        initialCurrentPage={3}
        onChangeCurrentPage={onChangeCurrentPage}
      />,
    );

    // 3 snaps back to 2, so the next spread is 4 rather than 5.
    await user.click(screen.getByLabelText("Next page"));
    expect(onChangeCurrentPage).toHaveBeenCalledWith(4);
  });

  it("takes its button labels from the text prop", () => {
    render(
      <ComicViewer
        pages={PAGES}
        text={{ expansion: "ひろげる", thumbnails: "一覧", move: "移動" }}
      />,
    );
    expect(
      screen.getByRole("button", { name: "ひろげる" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "一覧" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "移動" })).toBeInTheDocument();
  });

  it("accepts a render function for a page", () => {
    render(
      <ComicViewer
        pages={[
          ({ className }) => <p className={className}>drawn here</p>,
          "/2.jpg",
        ]}
      />,
    );
    expect(screen.getByText("drawn here")).toBeInTheDocument();
  });
});

/** Ten pages, so the eager window is visibly smaller than the book. */
const BOOK = Array.from({ length: 10 }, (_, i) => `/${i + 1}.jpg`);

/** The page images currently mounted, in reading order. */
function mountedPages(container: HTMLElement) {
  return [...container.querySelectorAll("img")]
    .map((img) => img.getAttribute("src") ?? "")
    .sort(
      (a, b) =>
        Number.parseInt(a.slice(1), 10) - Number.parseInt(b.slice(1), 10),
    );
}

describe("fetching pages", () => {
  it("mounts only the pages near the current one in a single view", () => {
    const { container } = render(<ComicViewer pages={BOOK} {...SINGLE} />);
    expect(mountedPages(container)).toEqual(["/1.jpg", "/2.jpg", "/3.jpg"]);
  });

  it("mounts two spreads ahead in a spread", () => {
    const { container } = render(<ComicViewer pages={BOOK} />);
    expect(mountedPages(container)).toEqual([
      "/1.jpg",
      "/2.jpg",
      "/3.jpg",
      "/4.jpg",
      "/5.jpg",
      "/6.jpg",
    ]);
  });

  it("keeps a page mounted once it has been near", async () => {
    const user = userEvent.setup();
    const { container } = render(<ComicViewer pages={BOOK} {...SINGLE} />);
    await user.click(screen.getByLabelText("Next page"));
    await user.click(screen.getByLabelText("Next page"));
    await user.click(screen.getByLabelText("Next page"));
    await user.click(screen.getByLabelText("Next page"));
    // On page 5 the window is 3..7; 1 and 2 were fetched on the way here.
    expect(mountedPages(container)).toEqual(BOOK.slice(0, 7));
  });

  it("mounts the first pages, not the last, in LTR", () => {
    const { container } = render(
      <ComicViewer pages={BOOK} direction="ltr" {...SINGLE} />,
    );
    expect(mountedPages(container)).toEqual(["/1.jpg", "/2.jpg", "/3.jpg"]);
  });

  it("follows the reader forward in an LTR spread with an odd page count", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ComicViewer pages={BOOK.slice(0, 9)} direction="ltr" />,
    );
    expect(mountedPages(container)).toEqual(BOOK.slice(0, 6));

    await user.click(screen.getByLabelText("Next page"));
    expect(mountedPages(container)).toEqual(BOOK.slice(0, 8));
  });

  it("lazy-loads thumbnails", async () => {
    const user = userEvent.setup();
    render(<ComicViewer pages={PAGES} />);
    await user.click(screen.getByRole("button", { name: "Thumbnails" }));
    for (const img of screen.getAllByRole("img", { name: /^Page / })) {
      expect(img).toHaveAttribute("loading", "lazy");
    }
  });

  it("still renders every page given as a render function", () => {
    render(
      <ComicViewer
        pages={BOOK.map((src) => ({ className }) => (
          <p className={className}>{src}</p>
        ))}
      />,
    );
    for (const src of BOOK) expect(screen.getByText(src)).toBeInTheDocument();
  });
});

describe("LTR", () => {
  it("turns forward with the next button", async () => {
    const user = userEvent.setup();
    const onChangeCurrentPage = vi.fn();
    render(
      <ComicViewer
        pages={PAGES}
        direction="ltr"
        {...SINGLE}
        onChangeCurrentPage={onChangeCurrentPage}
      />,
    );
    await user.click(screen.getByLabelText("Next page"));
    expect(onChangeCurrentPage).toHaveBeenCalledWith(1);
  });

  it("turns forward with ArrowRight and back with ArrowLeft", async () => {
    const user = userEvent.setup();
    const onChangeCurrentPage = vi.fn();
    render(
      <ComicViewer
        pages={PAGES}
        direction="ltr"
        {...SINGLE}
        onChangeCurrentPage={onChangeCurrentPage}
      />,
    );
    await user.keyboard("{ArrowRight}");
    expect(onChangeCurrentPage).toHaveBeenLastCalledWith(1);
    await user.keyboard("{ArrowLeft}");
    expect(onChangeCurrentPage).toHaveBeenLastCalledWith(0);
  });

  it("turns forward with ArrowLeft in RTL", async () => {
    const user = userEvent.setup();
    const onChangeCurrentPage = vi.fn();
    render(
      <ComicViewer
        pages={PAGES}
        {...SINGLE}
        onChangeCurrentPage={onChangeCurrentPage}
      />,
    );
    await user.keyboard("{ArrowLeft}");
    expect(onChangeCurrentPage).toHaveBeenCalledWith(1);
  });
});

describe("sizing", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lays out against its container, not the window", async () => {
    // The window is 1024x768, which opens a spread. A 300px-wide container is
    // taller than wide, so the viewer should fall back to a single view.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 300,
      height: 600,
    } as DOMRect);
    const user = userEvent.setup();
    const onChangeCurrentPage = vi.fn();
    const { container } = render(
      <ComicViewer pages={PAGES} onChangeCurrentPage={onChangeCurrentPage} />,
    );

    const firstPage = container.querySelector<HTMLElement>("[style*=width]");
    expect(firstPage?.style.width).toBe("300px");
    await user.click(screen.getByLabelText("Next page"));
    expect(onChangeCurrentPage).toHaveBeenCalledWith(1);
  });
});
