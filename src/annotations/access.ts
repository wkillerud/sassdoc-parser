import type { ParseResult } from "../types.js";

export default function access() {
	const defaultPrivatePrefixTest = RegExp.prototype.test.bind(/^[_-]/);

	return {
		name: "access",

		parse(text: string) {
			return text.trim();
		},

		autofill(item: ParseResult) {
			if (item.access !== "auto") {
				return;
			}

			if (defaultPrivatePrefixTest(item.context.name)) {
				return "private";
			}

			return "public";
		},

		resolve(data: ParseResult[]) {
			data.forEach((item) => {
				// Ensure valid access when not autofilled.
				if (item.access === "auto") {
					item.access = "public";
				}
			});
		},

		default() {
			return "auto";
		},

		multiple: false,
	};
}
