import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { keepWords, toAsciiDigits, toLocalDigits } from "./text";

describe("digits", () => {
  it("renders Burmese numerals only in Burmese", () => {
    expect(toLocalDigits(1989, "my")).toBe("၁၉၈၉");
    expect(toLocalDigits(1989, "en")).toBe("1989");
  });

  it("round-trips Burmese numerals to ASCII", () => {
    expect(toAsciiDigits("၀၉၄၂၃")).toBe("09423");
  });
});

describe("keepWords", () => {
  it("wraps each phrase in a nowrap span and keeps the spaces", () => {
    const { container } = render(<p>{keepWords("ပြုပြင် ရန်")}</p>);
    expect(container.querySelectorAll("span.whitespace-nowrap")).toHaveLength(2);
    expect(container.textContent).toBe("ပြုပြင် ရန်");
  });

  it("passes non-strings through untouched", () => {
    expect(keepWords(42)).toBe(42);
  });
});
