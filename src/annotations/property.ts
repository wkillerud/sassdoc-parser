import { Property } from "../types";

const reqRegEx =
  /\s*(?:{(.*)})?\s*(?:(\$?\S+))?\s*(?:\[([^\]]*)])?\s*-?\s*([\S\s]*)\s*$/;

export default function property() {
  return {
    name: "property",

    parse(text: string): Property {
      const match = reqRegEx.exec(text.trim()) as RegExpExecArray;

      const obj: Partial<Property> = {
        type: match[1] || "Map",
      };

      if (match[2]) {
        obj.name = match[2];
      }

      if (match[3]) {
        obj.default = match[3];
      }

      if (match[4]) {
        obj.description = match[4];
      }

      return obj as Property;
    },

    alias: ["prop"],

    allowedOn: ["variable"],
  };
}
