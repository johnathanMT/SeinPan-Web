import { useEffect, useRef, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { observeOnce } from "../../../shared/hooks/useInViewOnce";

/**
 * Scroll-reveal without an animation library. An IntersectionObserver sets
 * `data-inview` directly on the DOM node (no React re-render); CSS in
 * styles/index.css animates opacity + translate on the compositor.
 * Reduced-motion users get the content immediately.
 */
type RevealTag = "div" | "li" | "ol" | "ul" | "article";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  /** Delay in milliseconds. */
  delay?: number;
  children: ReactNode;
}

const OBSERVE = { rootMargin: "0px 0px -48px 0px", threshold: 0.12 } as const;

function useRevealRef() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    return observeOnce(el, () => el.setAttribute("data-inview", ""), OBSERVE);
  }, []);
  return ref;
}

export function Reveal({ as = "div", delay = 0, className = "", style, children, ...rest }: RevealProps) {
  const ref = useRevealRef();
  const Tag = as as ElementType;
  const merged = delay ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties) : style;
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={merged} {...rest}>
      {children}
    </Tag>
  );
}

interface RevealGroupProps extends HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  /** Delay between children, in seconds (matches the previous API). */
  stagger?: number;
  children: ReactNode;
}

/** Staggers its direct `RevealItem` children (index via CSS :nth-child). */
export function RevealGroup({ as = "div", stagger = 0.12, className = "", style, children, ...rest }: RevealGroupProps) {
  const ref = useRevealRef();
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      data-reveal-group=""
      className={className}
      style={{ ...style, "--reveal-stagger": `${Math.round(stagger * 1000)}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

interface RevealItemProps extends HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  children: ReactNode;
}

export function RevealItem({ as = "div", className = "", children, ...rest }: RevealItemProps) {
  const Tag = as as ElementType;
  return (
    <Tag className={`reveal-item ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
