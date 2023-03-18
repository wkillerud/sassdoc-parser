import type { ParseResult } from "../types.js";

export default function alias() {
  return {
    name: "alias",

    parse(text: string) {
      return text.trim();
    },

    resolve(data: ParseResult[]) {
      data.forEach((item) => {
        if (item.alias === undefined) {
          return;
        }

        const alias = item.alias;
        const name = item.context.name;

        const aliasedItem = data.find((i) => i.context.name === alias);

        if (aliasedItem === undefined) {
          console.warn(
            `Item \`${name}\` is an alias of \`${alias}\` but this item doesn't exist.`,
          );
          delete item.alias;
          return;
        }

        if (!Array.isArray(aliasedItem.aliased)) {
          aliasedItem.aliased = [];
        }

        aliasedItem.aliased.push(name);
      });
    },

    allowedOn: ["function", "mixin", "variable"],

    multiple: false,
  };
}
