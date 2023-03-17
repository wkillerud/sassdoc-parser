import type { ParseResult } from "../types.d.js";

export default function content() {
  return {
    name: "content",

    parse(text: string) {
      return text.trim();
    },

    autofill(item: ParseResult) {
      if (!item.content && item.context.code.indexOf("@content") > -1) {
        return "";
      }
      return;
    },

    allowedOn: ["mixin"],

    multiple: false,
  };
}
