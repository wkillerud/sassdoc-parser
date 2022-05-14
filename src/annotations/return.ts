import { ParseResult, Return } from "../types";

const typeRegEx = /^\s*(?:\{(.*)\})?\s*(?:-?\s*([\s\S]*))?/;

export default function returnAnnotation() {
  return {
    name: "return",

    parse(text: string, info: ParseResult, id?: string): Return | undefined {
      const parsed = typeRegEx.exec(text);
      const obj: Partial<Return> = {};

      if (!parsed) {
        return undefined;
      }

      if (parsed[1]) {
        obj.type = parsed[1];
      } else {
        console.warn(
          `@return must at least have a type. Location: ${id}:${info.commentRange.start}:${info.commentRange.end}`,
        );
        return undefined;
      }

      if (parsed[2]) {
        obj.description = parsed[2];
      }

      return obj as Return;
    },

    alias: ["returns"],

    allowedOn: ["function"],

    multiple: false,
  };
}
