import CDocParser from "cdocparser";

export interface Annotation {
	name: string;
	alias?: string[];
}

export interface Annotations {
	list: Omit<{ [x: string]: Annotation }, "_"> & {
		_: { alias: Map<string, string> };
	};
}

export interface ParserConfig {
	lineComment?: boolean;
	blockComment?: boolean;
	lineCommentStyle?: string;
	blockCommentStyle?: string;
}

export type Range = {
	start: number;
	end: number;
};

export type ContextType =
	| "unknown"
	| "function"
	| "mixin"
	| "placeholder"
	| "variable"
	| "css";

export interface Context {
	type: ContextType;
	name: string;
	value?: string;
	scope?: "private" | "global";
	code?: string;
	line: Range;
}

export interface ParseResult {
	description: string;
	commentRange: Range;
	context: Context;
}

/**
 * Extract the code following `offset` in `code` buffer,
 * delimited by braces.
 *
 * `offset` should be set to the position of the opening brace. If not,
 * the function will jump to the next opening brace.
 *
 * @param {String} code Code buffer.
 * @param {Number} offset Index of the opening brace.
 * @return {String} Extracted code between braces.
 */
const extractCode = function (code: string, offset: number): string {
	offset = offset || 0;

	if (code[offset] !== "{") {
		// The position is not valid, jump to next opening brace
		offset = code.indexOf("{", offset);
	}

	const start = offset + 1; // Ignore the opening brace
	let cursor = start;
	let depth = 1; // The opening brace is consumed
	const length = code.length;

	let inString = false;
	let openChar = "";

	// In block comment (line comments are instantly consumed)
	let inComment = false;

	while (cursor < length && depth > 0) {
		const cb = code[cursor - 1]; // Char before
		const c = code[cursor]; // Char
		const cn = code[cursor + 1]; // Char next

		if (!inString) {
			if (c === "/" && cn === "/" && !inComment) {
				// Swallow line comment
				cursor = Math.min(
					Math.max(code.indexOf("\r", cursor), code.indexOf("\n", cursor)),
					length,
				);
				continue;
			} else if (c === "/" && cn === "*") {
				// Block comment: begin
				cursor += 2; // Swallow opening
				inComment = true;
				continue;
			} else if (c === "*" && cn === "/") {
				// Block comment: end
				cursor += 2; // Swallow closing
				inComment = false;
				continue;
			}
		}

		if (!inComment) {
			if ((c === '"' || c === "'") && cb !== "\\") {
				if (!inString) {
					// String: begin
					openChar = c;
					inString = true;
					cursor++;
					continue;
				} else if (openChar === c) {
					// String: end
					inString = false;
					cursor++;
					continue;
				}
			}
		}

		if (!(inString || inComment)) {
			if (c === "{") {
				depth++;
			} else if (c === "}") {
				depth--;
			}
		}

		cursor++;
	}

	if (depth > 0) {
		return "";
	}

	// Ignore the closing brace
	cursor--;

	return code.substring(start, cursor);
};

const findCodeStart = function (ctxCode: string, lastMatch?: number) {
	const codeStart = ctxCode.indexOf("{", lastMatch);

	if (codeStart < 0 || ctxCode[codeStart - 1] !== "#") {
		return codeStart;
	}

	return findCodeStart(ctxCode, codeStart + 1);
};

const addCodeToContext = function (
	context: Context,
	ctxCode: string,
	match: RegExpMatchArray,
): number | undefined {
	const codeStart = findCodeStart(ctxCode, match.index);

	if (codeStart >= 0) {
		context.code = extractCode(ctxCode, codeStart);
		return codeStart + context.code.length + 1; // Add closing brace!
	}

	return undefined;
};

/**
 * SCSS Context Parser
 */
const scssContextParser = (function () {
	const ctxRegEx =
		/^(@|%|\$)([\w-_]+)*(?:\s+([\w-_]+)|[\s\S]*?:([\s\S]*?)(?:\s!(\w+))?;[ \t]*?(?=\/\/|\n|$))?/;

	const parser = function (
		ctxCode: string,
		lineNumberFor: (index?: number) => number,
	): Context {
		const match = ctxRegEx.exec(ctxCode.trim());
		let startIndex, endIndex;

		const context: Context = {
			type: "unknown",
		} as Context;

		if (match) {
			const wsOffset = Math.min(ctxCode.match(/\s*/)!.length - 1, 0);
			startIndex = wsOffset + match.index;
			endIndex = startIndex + match[0].length;

			if (
				match[1] === "@" &&
				(match[2] === "function" || match[2] === "mixin")
			) {
				context.type = match[2];
				context.name = match[3];
				endIndex = addCodeToContext(context, ctxCode, match);
			} else if (match[1] === "%") {
				context.type = "placeholder";
				context.name = match[2];
				endIndex = addCodeToContext(context, ctxCode, match);
			} else if (match[1] === "$") {
				context.type = "variable";
				context.name = match[2];
				context.value = match[4].trim();
				context.scope = (match[5] || "private") as "private" | "global";
			}
		} else {
			startIndex = findCodeStart(ctxCode, 0);
			endIndex = ctxCode.length - 1;

			if (startIndex > 0) {
				context.type = "css";
				context.name = ctxCode.slice(0, startIndex).trim();
				context.value = extractCode(ctxCode, startIndex).trim();
			}
		}

		if (lineNumberFor !== undefined && startIndex !== undefined) {
			context.line = {
				start: lineNumberFor(startIndex) + 1,
				end: lineNumberFor(endIndex) + 1,
			};
		}

		return context;
	};

	return parser;
})();

const filterAndGroup = function (lines: string[]) {
	const nLines: string[] = [];
	let group = false;

	lines.forEach(function (line) {
		const isAnnotation = line.indexOf("@") === 0;

		if (line.trim().indexOf("---") !== 0) {
			// Ignore lines that start with "---"
			if (group) {
				if (isAnnotation) {
					nLines.push(line);
				} else {
					nLines[nLines.length - 1] += "\n" + line;
				}
			} else if (isAnnotation) {
				group = true;
				nLines.push(line);
			} else {
				nLines.push(line);
			}
		}
	});

	return nLines;
};

const extractor = new CDocParser.CommentExtractor(scssContextParser, {
	blockComment: false,
});

class Parser {
	commentParser: CDocParser.CommentParser;

	contextParser = scssContextParser.bind(this);
	extractCode = extractCode.bind(this);

	constructor(annotations: unknown, config: unknown) {
		this.commentParser = new CDocParser.CommentParser(annotations, config);
	}

	parse(code: string, id?: string) {
		const comments = extractor.extract(code);

		comments.forEach(function (comment: { lines: string[] }) {
			comment.lines = filterAndGroup(comment.lines);
		});

		return this.commentParser.parse(comments, id);
	}
}

export default Parser;
