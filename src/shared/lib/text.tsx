import { cloneElement, isValidElement, type ReactNode } from "react";

export type Lang = "my" | "en";

const WORD_OR_SPACE = /(\s+)/;
const WHITESPACE_ONLY = /^\s+$/;

/**
 * Browsers break Burmese between syllables, splitting words mid-line.
 * Wrapping each space-separated phrase in a nowrap span means lines only
 * break at spaces. Non-string input is returned unchanged.
 */
export function keepWords(text: ReactNode): ReactNode {
  if (typeof text !== "string") return text;
  return text.split(WORD_OR_SPACE).map((part, i) =>
    !part || WHITESPACE_ONLY.test(part) ? (
      part
    ) : (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ),
  );
}

/** keepWords for a child that may be an element wrapping a plain string. */
export function keepNodeWords(node: ReactNode): ReactNode {
  if (isValidElement<{ children?: ReactNode }>(node) && typeof node.props.children === "string") {
    return cloneElement(node, undefined, keepWords(node.props.children));
  }
  return keepWords(node);
}

const MY_DIGITS = "၀၁၂၃၄၅၆၇၈၉";

/** Renders Western digits as Burmese numerals when the UI is in Burmese. */
export function toLocalDigits(value: number | string, lang: Lang): string {
  const s = String(value);
  return lang === "my" ? s.replace(/[0-9]/g, (d) => MY_DIGITS[Number(d)] ?? d) : s;
}

/** Converts Burmese numerals (၀–၉) to ASCII digits. */
export function toAsciiDigits(value: string): string {
  return value.replace(/[၀-၉]/g, (d) => String(MY_DIGITS.indexOf(d)));
}
