/// <reference types="node" />

declare module "cdocparser" {
	import { EventEmitter } from "events";

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
		syntax?: "scss" | "indented";
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

	export class CommentParser extends EventEmitter {
		constructor(annotations: Annotations, config?: ParserConfig);
		parse(comments: ExtractedComment[], id?: string): ParseResult[];
	}

	export type ContextParser = (
		code: string,
		lineNumberFor: (index?: number) => number,
	) => Context;

	type ExtractedComment = {
		lines: string[];
		type: "block" | "line" | "poster";
		commentRange: Range;
		context: Context;
	};

	export class CommentExtractor {
		constructor(contextParser: ContextParser, config?: ParserConfig);

		extract(code: string): ExtractedComment[];
	}
}
