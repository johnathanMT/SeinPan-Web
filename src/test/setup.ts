import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "../shared/i18n";

// jsdom has no layout engine: provide the browser APIs the app relies on.
function mediaQueryList(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  };
}
window.matchMedia = (query: string) => mediaQueryList(query);

class ImmediateIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0];
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe(target: Element): void {
    const rect = target.getBoundingClientRect();
    const entry = {
      target,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: rect,
      intersectionRect: rect,
      rootBounds: null,
      time: 0,
    } satisfies IntersectionObserverEntry;
    queueMicrotask(() => this.callback([entry], this));
  }
  unobserve(): void {
    /* no-op */
  }
  disconnect(): void {
    /* no-op */
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
window.IntersectionObserver = ImmediateIntersectionObserver;

class NoopResizeObserver implements ResizeObserver {
  observe(): void {
    /* no-op */
  }
  unobserve(): void {
    /* no-op */
  }
  disconnect(): void {
    /* no-op */
  }
}
window.ResizeObserver = NoopResizeObserver;

window.scrollTo = () => undefined;
HTMLElement.prototype.scrollIntoView = () => undefined;

afterEach(() => {
  cleanup();
});
