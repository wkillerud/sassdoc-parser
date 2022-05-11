import { ParseResult } from "../types";

export default function name() {
  return {
    name: "name",

    parse(text: string) {
      return text.trim();
    },

    // Abuse the autofill feature to rewrite the `item.context`
    autofill(item: ParseResult) {
      if (item.name) {
        item.context.name = item.name;
        // Cleanup
        delete item.name;
      }
    },

    multiple: false,
  };
}
