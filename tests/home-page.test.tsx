// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HomePage } from "../apps/web/features/home/home-page";
import { PortfolioPreview } from "../apps/web/features/home/portfolio-preview";

beforeEach(() =>
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  ),
);
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const guest = {
  href: "/admin/login",
  label: "Create your portfolio",
  signedIn: false,
};
it("introduces the platform and gives visitors working creation and public example links", () => {
  render(<HomePage action={guest} exampleHref="/yusufyilmz" />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
    "Your work.",
  );
  for (const link of screen.getAllByRole("link", {
    name: /Create your portfolio/,
  }))
    expect(link.getAttribute("href")).toBe("/admin/login");
  expect(
    screen
      .getByRole("link", { name: /See a real portfolio/ })
      .getAttribute("href"),
  ).toBe("/yusufyilmz");
  expect(screen.getByText("Illustrative preview")).toBeTruthy();
  expect(screen.getByRole("main").id).toBe("home-content");
});
it("routes an authenticated owner to their own editor and uses the published example without a local profile", () => {
  render(
    <HomePage
      action={{
        href: "/alice/edit",
        label: "Open your studio",
        signedIn: true,
      }}
      exampleHref={null}
    />,
  );
  expect(
    screen.getByRole("link", { name: /My studio/ }).getAttribute("href"),
  ).toBe("/alice/edit");
  for (const link of screen.getAllByRole("link", { name: /Open your studio/ }))
    expect(link.getAttribute("href")).toBe("/alice/edit");
  expect(
    screen
      .getByRole("link", { name: /See a real portfolio/ })
      .getAttribute("href"),
  ).toBe("https://mydevstudio.vercel.app/yusufyilmz");
});
it("switches the example between portfolio and PDF with labelled tabs and keyboard navigation", () => {
  render(<PortfolioPreview />);
  const portfolio = screen.getByRole("tab", { name: "Portfolio" }),
    cv = screen.getByRole("tab", { name: "CV" });
  expect(portfolio.getAttribute("aria-selected")).toBe("true");
  fireEvent.keyDown(portfolio, { key: "ArrowRight" });
  expect(cv.getAttribute("aria-selected")).toBe("true");
  expect(document.activeElement).toBe(cv);
  expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(
    cv.id,
  );
  expect(screen.getByText("YOUR DOWNLOADABLE CV")).toBeTruthy();
  fireEvent.keyDown(cv, { key: "Home" });
  expect(portfolio.getAttribute("aria-selected")).toBe("true");
  expect(document.activeElement).toBe(portfolio);
  fireEvent.click(screen.getByRole("button", { name: /Preview your CV/ }));
  expect(cv.getAttribute("aria-selected")).toBe("true");
  expect(document.activeElement).toBe(cv);
});
it("previews accent choices without navigation or modifying a portfolio", () => {
  const { container } = render(<PortfolioPreview />);
  const violet = screen.getByRole("button", { name: "Preview in violet" });
  fireEvent.click(violet);
  expect(violet.getAttribute("aria-pressed")).toBe("true");
  expect(
    screen
      .getByRole("button", { name: "Preview in cyan" })
      .getAttribute("aria-pressed"),
  ).toBe("false");
  expect(
    container
      .querySelector("[data-preview-accent]")
      ?.getAttribute("data-preview-accent"),
  ).toBe("violet");
});
it("uses native expandable questions and explains publishing and PDF contact visibility", () => {
  render(<HomePage action={guest} exampleHref={null} />);
  expect(
    screen
      .getByText("Is my portfolio public as soon as I sign up?")
      .closest("details"),
  ).toBeTruthy();
  expect(screen.getByText(/Your portfolio starts private/)).toBeTruthy();
  expect(
    screen.getByText(/PDF contact settings affect the PDF only/),
  ).toBeTruthy();
});
