import type { ParseResult } from "../types.js";

const seeRegEx = /\s*(?:\{([\w-_]+)\}\s*)?(.*)/;

export default function see() {
	return {
		name: "see",

		parse(text: string) {
			const match = seeRegEx.exec(text) as RegExpExecArray;

			const obj = {
				type: match[1] || "function",
				name: match[2],
			};

			if (obj.name.indexOf("$") === 0) {
				obj.type = "variable";
				obj.name = obj.name.slice(1);
			}

			if (obj.name.indexOf("%") === 0) {
				obj.type = "placeholder";
				obj.name = obj.name.slice(1);
			}

			return obj;
		},

		resolve(data: ParseResult[]) {
			data.forEach((item) => {
				if (item.see === undefined) {
					return;
				}

				item.see = item.see
					.map((see) => {
						const seeItem = data.find((x) => x.context.name === see.name);

						if (!seeItem) {
							console.warn(
								`Item \`${item.context.name}\` refers to \`${see.name}\` from type \`${see.type}\` but this item doesn't exist.`,
							);
						}

						return seeItem;
					})
					.filter((x) => x !== undefined) as ParseResult[];
			});
		},
	};
}
