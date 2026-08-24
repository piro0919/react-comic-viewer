import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    render(<ComicViewer pages={PAGES} onChangeCurrentPage={onChangeCurrentPage} />);

    await user.click(screen.getByLabelText("Next page"));
    expect(onChangeCurrentPage).toHaveBeenCalledWith(2);
  });

  it("turns one page at a time when the window is tall enough for a single view", async () => {
    const user = userEvent.setup();
    const onChangeCurrentPage = vi.fn();
    render(
      <ComicViewer pages={PAGES} {...SINGLE} onChangeCurrentPage={onChangeCurrentPage} />,
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
    expect(screen.getByRole("button", { name: "ひろげる" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "一覧" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "移動" })).toBeInTheDocument();
  });

  it("accepts a render function for a page", () => {
    render(
      <ComicViewer
        pages={[({ className }) => <p className={className}>drawn here</p>, "/2.jpg"]}
      />,
    );
    expect(screen.getByText("drawn here")).toBeInTheDocument();
  });
});
