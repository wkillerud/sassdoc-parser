import { Parameter, ParseResult } from "../types.js";

const typeRegEx =
  /^\s*(?:\{(.*)\})?\s*(?:\$?([^\s^\][]+))?\s*(?:\[([^\]]*)\])?\s*(?:-?\s*([\s\S]*))?/;

export default function parameter() {
  return {
    name: "parameter",

    parse(text: string, info: ParseResult, id?: string): Parameter | undefined {
      const parsed = typeRegEx.exec(text);
      const obj: Partial<Parameter> = {};

      if (!parsed) {
        return undefined;
      }

      if (parsed[1]) {
        obj.type = parsed[1];
      }

      if (parsed[2]) {
        obj.name = parsed[2];
      } else {
        console.warn(
          `@parameter must at least have a name. Location: ${id}:${info.commentRange.start}:${info.commentRange.end}`,
        );
        return undefined;
      }

      if (parsed[3]) {
        obj.default = parsed[3];
      }

      if (parsed[4]) {
        obj.description = parsed[4];
      }

      return obj as Parameter;
    },

    alias: ["arg", "argument", "arguments", "param", "parameters"],

    allowedOn: ["function", "mixin"],
  };
}
