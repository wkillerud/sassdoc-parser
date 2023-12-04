import type { ParseResult } from "./types.js";

export default function sort(data: Array<ParseResult>) {
	return data.sort((a, b) => {
		return (
			compare(
				a.group?.[0].toLowerCase() || "",
				b.group?.[0].toLowerCase() || "",
			) ||
			compare(a.file?.path || "", b.file?.path || "") ||
			compare(a.context.line.start, b.context.line.start)
		);
	});
}

function compare(a: string | number, b: string | number) {
	switch (true) {
		case a > b:
			return 1;
		case a === b:
			return 0;
		default:
			return -1;
	}
}
