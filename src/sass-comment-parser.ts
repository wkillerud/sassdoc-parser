import {
	CommentExtractor,
	CommentParser,
	ParserConfig as CDocParserConfig,
	Annotations,
	Annotation,
	Range,
	Context,
	ContextType,
} from "cdocparser";
import { ParseResult } from "./types.js";

export type {
	Annotation,
	Annotations,
	Range,
	Context,
	ContextType,
	ParseResult,
};

export interface ParserConfig extends CDocParserConfig {
	syntax?: "scss" | "indented";
}

// Look for strings starting with @ (an at-rule like @mixin or @function) or % (placeholder selector) or $ (variable) followed by an identifier.
const contextRe =
	/^(@|%|\$)([\w-_]+)*(?:\s+([\w-_]+)|[\s\S]*?:([\s\S]*?)(?:\s!(\w+))?;?[ \t]*?(?=\/\/|\n|$))?/;

class Parser {
	commentParser: CommentParser;
	private extractor: CommentExtractor;
	private syntax: "scss" | "indented";

	constructor(annotations: Annotations, config?: ParserConfig) {
		this.syntax = config?.syntax || "scss";
		this.commentParser = new CommentParser(annotations, config);
		this.extractor = new CommentExtractor(this.contextParser.bind(this), {
			blockComment: false,
		});
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
	private _extractCode(code: string, offset: number): string {
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
	}

	private contextParser(
		ctxCode: string,
		lineNumberFor: (index?: number) => number,
	): Context {
		const match = contextRe.exec(ctxCode.trim());
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
				endIndex = this._addCodeToContext(context, ctxCode, match);
			} else if (match[1] === "%") {
				context.type = "placeholder";
				context.name = match[2];
				endIndex = this._addCodeToContext(context, ctxCode, match);
			} else if (match[1] === "$") {
				context.type = "variable";
				context.name = match[2];
				context.value = match[4].trim();
				context.scope = (match[5] || "private") as "private" | "global";
			}
		} else {
			startIndex = this._findCodeStart(ctxCode, 0);
			endIndex = ctxCode.length - 1;

			if (startIndex > 0) {
				context.type = "css";
				context.name = ctxCode.slice(0, startIndex).trim();
				context.value = this._extractCode(ctxCode, startIndex).trim();
			}
		}

		if (
			lineNumberFor !== undefined &&
			startIndex !== undefined &&
			endIndex !== undefined
		) {
			context.line = {
				start: lineNumberFor(startIndex) + 1,
				end: lineNumberFor(endIndex) + 1,
			};
		}

		return context;
	}

	private _findCodeStart(ctxCode: string, lastMatch?: number): number {
		const codeStart = ctxCode.indexOf("{", lastMatch);

		if (codeStart < 0 || ctxCode[codeStart - 1] !== "#") {
			return codeStart;
		}

		return this._findCodeStart(ctxCode, codeStart + 1);
	}

	private _addCodeToContext(
		context: Context,
		ctxCode: string,
		match: RegExpMatchArray,
	): number | undefined {
		const codeStart = this._findCodeStart(ctxCode, match.index);

		if (codeStart >= 0) {
			context.code = this._extractCode(ctxCode, codeStart);
			return codeStart + context.code!.length + 1; // Add closing brace!
		} else {
			context.code = "";
		}

		return undefined;
	}

	parse(code: string, id?: string): ParseResult[] {
		const comments = this.extractor.extract(code);
		for (const comment of comments) {
			comment.lines = this._filterAndGroup(comment.lines);
		}
		return this.commentParser.parse(comments, id) as ParseResult[];
	}

	private _filterAndGroup(lines: string[]): string[] {
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
	}
}

export default Parser;
