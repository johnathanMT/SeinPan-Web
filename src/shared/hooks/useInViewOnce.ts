import { useEffect, useState, type RefObject } from "react";

/**
 * One shared IntersectionObserver per option set, instead of one observer
 * per animated element. Each target is observed until it first intersects,
 * then released.
 */
interface ObserveOptions {
  rootMargin?: string;
  threshold?: number;
}

interface Registry {
  observer: IntersectionObserver;
  callbacks: Map<Element, () => void>;
}

const registries = new Map<string, Registry>();

function getRegistry({ rootMargin = "0px", threshold = 0 }: ObserveOptions): Registry {
  const key = `${rootMargin}|${threshold}`;
  const existing = registries.get(key);
  if (existing) return existing;

  const callbacks = new Map<Element, () => void>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cb = callbacks.get(entry.target);
        callbacks.delete(entry.target);
        observer.unobserve(entry.target);
        cb?.();
      }
    },
    { rootMargin, threshold },
  );
  const registry = { observer, callbacks };
  registries.set(key, registry);
  return registry;
}

/** Calls `onEnter` once when `el` enters the viewport. Returns a cleanup. */
export function observeOnce(el: Element, onEnter: () => void, options: ObserveOptions = {}): () => void {
  if (typeof IntersectionObserver === "undefined") {
    onEnter();
    return () => {
      /* nothing to disconnect */
    };
  }
  const { observer, callbacks } = getRegistry(options);
  callbacks.set(el, onEnter);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer.unobserve(el);
  };
}

/** React state version, for mounting things (e.g. lazy decor) near the viewport. */
export function useInViewOnce<T extends Element>(ref: RefObject<T | null>, options: ObserveOptions = {}): boolean {
  const [inView, setInView] = useState(false);
  const { rootMargin, threshold } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return undefined;
    return observeOnce(el, () => setInView(true), { rootMargin, threshold });
  }, [ref, inView, rootMargin, threshold]);
  return inView;
}
