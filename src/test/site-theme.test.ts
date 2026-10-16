import { describe, expect, it } from "vitest";
import { applySiteColors, resolveSiteColors } from "@/lib/site-theme";

describe("Free administrator color selection", () => {
  it("preserves arbitrary selected colors without restricting a palette", () => {
    const colors = resolveSiteColors({ colors: { primary: "#123456", background: "#102030", foreground: "#abcdef" } });
    const target = document.createElement("div");
    applySiteColors(colors, target);
    expect(target.style.getPropertyValue("--primary")).toBe("#123456");
    expect(target.style.getPropertyValue("--background")).toBe("#102030");
    expect(target.style.getPropertyValue("--foreground")).toBe("#abcdef");
  });
  it("does not apply malformed color values", () => {
    expect(resolveSiteColors({ colors: { primary: "url(https://example.org)" } }).primary).toBe("#bd6245");
  });
});