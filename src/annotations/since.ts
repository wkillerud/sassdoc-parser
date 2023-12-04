import { Since } from "../types.js";

const sinceRegEx = /\s*([^\s]*)\s*(?:-?\s*([\s\S]*))?\s*$/;

export default function since() {
	return {
		name: "since",

		parse(text: string): Since {
			const parsed = sinceRegEx.exec(text) as RegExpExecArray;
			const obj: Since = {};

			if (parsed[1]) {
				obj.version = parsed[1];
			}

			if (parsed[2]) {
				obj.description = parsed[2];
			}

			return obj;
		},
	};
}
