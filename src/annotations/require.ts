import { ParseResult, Require } from "../types";

const reqRegEx =
  /^\s*(?:\{(.*)\})?\s*(?:(\$?[^\s]+))?\s*(?:-?\s*([^<$]*))?\s*(?:<?\s*(.*)\s*>)?$/;

// Namespace delimiters.
const nsDelimiters = ["::", ":", "\\.", "/"];
const ns = new RegExp(nsDelimiters.join("|"), "g");

// Split a namespace on possible namespace delimiters.
const splitNamespace = (value: string) => value.split(ns);

export default function requireAnnotation() {
  return {
    name: "require",

    parse(text: string): Require {
      const match = reqRegEx.exec(text.trim()) as RegExpExecArray;

      const obj = {
        type: match[1] || "function",
        name: match[2] as string,
        external: false,
        description: undefined as string | undefined,
        url: undefined as string | undefined,
      };

      obj.external = splitNamespace(obj.name).length > 1;

      if (obj.name.indexOf("$") === 0) {
        obj.type = "variable";
        obj.name = obj.name.slice(1);
      }

      if (obj.name.indexOf("%") === 0) {
        obj.type = "placeholder";
        obj.name = obj.name.slice(1);
      }

      if (match[3]) {
        obj.description = match[3].trim();
      }

      if (match[4]) {
        obj.url = match[4];
      }

      return obj;
    },

    autofill(item: ParseResult): Array<Require> | undefined {
      const type = item.context.type;
      const shouldContinue =
        type === "mixin" || type === "placeholder" || type === "function";

      if (!shouldContinue) {
        return;
      }

      let handWritten: Record<string, boolean> | undefined;

      if (item.require) {
        handWritten = {};
        for (const reqObj of item.require) {
          handWritten[reqObj.type + "-" + reqObj.name] = true;
        }
      }

      const mixinsMatches = searchForMatches(
        item.context.code,
        /@include\s+([^(;$]*)/gi,
        isAnnotatedByHand.bind(null, handWritten, "mixin"),
      );

      const functionsMatches = searchForMatches(
        item.context.code,
        new RegExp("(@include)?\\s*([a-z0-9_-]+)\\s*\\(", "ig"), // Literal destorys Syntax
        isAnnotatedByHand.bind(null, handWritten, "function"),
        2, // Get the second matching group instead of 1
      );

      const placeholdersMatches = searchForMatches(
        item.context.code,
        /@extend\s*%([^;\s]+)/gi,
        isAnnotatedByHand.bind(null, handWritten, "placeholder"),
      );

      const variablesMatches = searchForMatches(
        item.context.code,
        /\$([a-z0-9_-]+)/gi,
        isAnnotatedByHand.bind(null, handWritten, "variable"),
      );

      // Create object for each required item.
      const mixins = mixinsMatches.map(typeNameObject("mixin"));
      const functions = functionsMatches.map(typeNameObject("function"));
      const placeholders = placeholdersMatches.map(
        typeNameObject("placeholder"),
      );
      const variables = variablesMatches.map(typeNameObject("variable"));

      // Merge all arrays.
      let all = mixins.concat(functions, placeholders, variables);

      // Merge in user supplyed requires if there are any.
      if (item.require && item.require.length > 0) {
        all = all.concat(item.require);
      }

      // Filter empty values.
      let filtered = all.filter((x) => {
        return x !== undefined;
      }) as Array<Require>;

      if (filtered.length === 0) {
        return;
      }

      // Filter the item itself.
      filtered = filtered.filter((x) => {
        return !(x.name === item.context.name && x.type === item.context.type);
      });

      return filtered;
    },

    resolve(data: ParseResult[]) {
      data.forEach((item) => {
        if (item.require === undefined) {
          return;
        }

        item.require = item.require
          .map((req) => {
            if (req.external === true) {
              return req;
            }

            const reqItem = data.find(
              (x) => x.context.name === req.name && x.context.type === req.type,
            );

            if (reqItem === undefined) {
              if (!req.autofill) {
                console.warn(
                  `Item \`${item.context.name}\` requires \`${req.name}\` from type \`${req.type}\` but this item doesn't exist.`,
                );
              }

              return;
            }

            if (!Array.isArray(reqItem.usedBy)) {
              reqItem.usedBy = [];
            }

            reqItem.usedBy.push(item);
            req.item = reqItem;

            return req;
          })
          .filter((x) => x !== undefined) as Require[];
      });
    },

    alias: ["requires"],
  };
}

function isAnnotatedByHand(
  handWritten?: Record<string, boolean>,
  type?: "mixin" | "function" | "placeholder" | "variable",
  name?: string,
): boolean {
  if (type && name && handWritten) {
    return handWritten[type + "-" + name];
  }

  return false;
}

function searchForMatches(
  code: string,
  regex: RegExp,
  isAnnotatedByHandProxy: (match: string) => boolean,
  id = 1,
) {
  let match;
  const matches = [];

  while ((match = regex.exec(code))) {
    if (
      !isAnnotatedByHandProxy(match[id]) &&
      (id <= 1 || match[id - 1] === undefined)
    ) {
      matches.push(match[id]);
    }
  }

  return matches;
}

function typeNameObject(
  type: "mixin" | "function" | "placeholder" | "variable",
) {
  return function (name: string): Require | undefined {
    if (name.length === 0) {
      return;
    }
    return {
      type: type,
      name: name,
      autofill: true,
    };
  };
}
