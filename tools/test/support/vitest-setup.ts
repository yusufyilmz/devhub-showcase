class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (media) =>
    Object.assign(new EventTarget(), {
      addListener() {
        // Legacy listener API. Tests use addEventListener.
      },
      matches: false,
      media,
      onchange: null,
      removeListener() {
        // Legacy listener API. Tests use removeEventListener.
      },
    });
}
