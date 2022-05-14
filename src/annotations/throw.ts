import uniq from "lodash.uniq";
import { ParseResult } from "../types";

const autoParserError = /@error\s+(?:'|")([^'"]+)/g;

export default function throwAnnotation() {
  return {
    name: "throw",

    parse(text: string) {
      return text.trim();
    },

    autofill(item: ParseResult): string[] | undefined {
      let match;
      const throwing = item.throws || [];

      while ((match = autoParserError.exec(item.context.code))) {
        throwing.push(match[1]);
      }

      if (throwing.length === 0) {
        return;
      }

      return uniq(throwing);
    },

    alias: ["throws", "exception"],

    allowedOn: ["function", "mixin", "placeholder"],
  };
}
