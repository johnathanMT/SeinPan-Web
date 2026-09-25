import { describe, expect, it } from "vitest";
import { INQUIRY_LIMITS, isValidEmail, isValidPhone, normalizePhone, sanitizeText, validateInquiry } from "./sanitize";

describe("sanitizeText", () => {
  it("returns an empty string for non-string input", () => {
    expect(sanitizeText(undefined, { maxLength: 10 })).toBe("");
    expect(sanitizeText({ toString: () => "x" }, { maxLength: 10 })).toBe("");
  });

  it("strips control characters and collapses whitespace", () => {
    expect(sanitizeText("  Ko\u0000 Win\u0007\t\tNaing \n", { maxLength: 80 })).toBe("Ko Win Naing");
  });

  it("strips bidirectional override characters (Trojan Source)", () => {
    const spoofed = "invoice‮gpj.exe";
    expect(sanitizeText(spoofed, { maxLength: 80 })).toBe("invoicegpj.exe");
  });

  it("keeps line breaks in multi-line fields but limits blank lines", () => {
    expect(sanitizeText("line 1\r\n\r\n\r\n\r\nline   2", { maxLength: 100, multiline: true })).toBe("line 1\n\nline 2");
  });

  it("normalises to NFC", () => {
    const decomposed = "é";
    expect(sanitizeText(decomposed, { maxLength: 5 })).toBe("é");
  });

  it("clamps length without splitting Burmese graphemes or emoji", () => {
    const burmese = "မြန်မာ"; // several code points per visible character
    const clamped = sanitizeText(burmese, { maxLength: 2 });
    expect(burmese.startsWith(clamped)).toBe(true);
    expect(sanitizeText("👍🏽👍🏽👍🏽", { maxLength: 2 })).toBe("👍🏽👍🏽");
  });

  it("keeps markup as inert text (React escapes it on render)", () => {
    expect(sanitizeText("<img src=x onerror=alert(1)>", { maxLength: 100 })).toBe("<img src=x onerror=alert(1)>");
  });
});

describe("field validators", () => {
  it.each(["a@b.co", "ko.win@example.com.mm", "USER+tag@mail.example.org"])("accepts email %s", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(["", "no-at-sign", "a@b", "a@-bad.com", "<a>@b.com", "a b@c.com"])("rejects email %s", (email) => {
    expect(isValidEmail(email)).toBe(false);
  });

  it("accepts Myanmar numbers in Western or Burmese digits", () => {
    expect(isValidPhone("09 423 858 609")).toBe(true);
    expect(isValidPhone("+95 9 423858609")).toBe(true);
    expect(isValidPhone("၀၉၄၂၃၈၅၈၆၀၉")).toBe(true);
    expect(normalizePhone("၀၉-၄၂၃၈၅၈၆၀၉")).toBe("09423858609");
  });

  it("rejects phone numbers with letters or markup", () => {
    expect(isValidPhone("09423858609<script>")).toBe(false);
    expect(isValidPhone("call me")).toBe(false);
    expect(isValidPhone("12")).toBe(false);
  });
});

describe("validateInquiry", () => {
  const valid = { name: "ဦးဝင်းနိုင်", email: "Ko.Win@Example.com", phone: "09423858609", message: "TV has no picture." };

  it("accepts a normal Burmese inquiry and normalises it", () => {
    const result = validateInquiry(valid);
    expect(result.valid).toBe(true);
    expect(result.data.email).toBe("ko.win@example.com");
    expect(result.data.phone).toBe("09423858609");
  });

  it("flags required fields", () => {
    const result = validateInquiry({ name: " ", email: "", phone: "", message: "\n" });
    expect(result.errors).toEqual({ name: "required", email: "required", message: "required" });
  });

  it("rejects script injection in the name", () => {
    expect(validateInquiry({ ...valid, name: "<script>alert(1)</script>" }).errors.name).toBe("invalidName");
  });

  it("rejects SQL-looking names (defence in depth; the API must parameterise anyway)", () => {
    expect(validateInquiry({ ...valid, name: "Robert'); DROP TABLE Inquiries;--" }).errors.name).toBe("invalidName");
  });

  it("rejects link spam in the message", () => {
    const spam = "see http://a.io http://b.io http://c.io";
    expect(validateInquiry({ ...valid, message: spam }).errors.message).toBe("tooManyLinks");
  });

  it("caps every field at its limit", () => {
    const long = "a".repeat(10_000);
    const { data } = validateInquiry({ name: long, email: long, phone: long, message: long });
    expect(data.name.length).toBeLessThanOrEqual(INQUIRY_LIMITS.name);
    expect(data.message.length).toBeLessThanOrEqual(INQUIRY_LIMITS.message);
  });
});
