import AnnotationsApi, { type BuiltInAnnotationNames } from "./annotation.js";
import SassCommentParser, {
	type Annotations,
	type ParserConfig,
} from "./sass-comment-parser.js";
import sorter from "./sorter.js";
import type { ParseResult } from "./types.js";
import { removeReduntantWhitespace } from "./utils.js";

export class Parser {
	annotations: AnnotationsApi;
	commentParser: SassCommentParser;

	constructor(parserConfig?: ParserConfig) {
		this.annotations = new AnnotationsApi();
		this.commentParser = new SassCommentParser(
			this.annotations.list as unknown as Annotations,
			parserConfig,
		);
		this.commentParser.commentParser.on("warning", (warning: Error) => {
			console.warn(warning.message);
		});
	}

	async parseString(
		code: string,
		options?: ParseOptions,
	): Promise<ParseResult[]> {
		let data = this.commentParser.parse(
			removeReduntantWhitespace(code),
			options?.id,
		);
		data = sorter(data);

		data = data.map((d) => {
			if (!d.name) {
				// Give everything a default name from context
				d.name = d.context.name;
			}
			return d;
		});

		const promises: Array<Promise<void>> = [];
		Object.keys(this.annotations.list).forEach((key: string) => {
			const annotation = this.annotations.list[key as BuiltInAnnotationNames];

			if (annotation.resolve) {
				const promise = Promise.resolve(annotation.resolve(data));
				promises.push(promise);
			}
		});

		return Promise.all(promises).then(() => data);
	}

	parseStringSync(code: string, options?: ParseOptions): ParseResult[] {
		let data = this.commentParser.parse(
			removeReduntantWhitespace(code),
			options?.id,
		);
		data = sorter(data);

		data = data.map((d) => {
			if (!d.name) {
				// Give everything a default name from context
				d.name = d.context.name;
			}
			return d;
		});

		Object.keys(this.annotations.list).forEach((key: string) => {
			const annotation = this.annotations.list[key as BuiltInAnnotationNames];

			if (annotation.resolve) {
				const result = annotation.resolve(data);
				if (typeof result !== "undefined") {
					throw new Error("Tried to resolve an async annotation in parseSync");
				}
			}
		});

		return data;
	}
}

export type ParseOptions = {
	id?: string;
	parserConfig?: ParserConfig;
};

/**
 * Try to parse any SassDoc in the input
 *
 * @example SCSS
 *  await parse(`
 *    /// Main color
 *    $stardew: #ffffff;
 *  `);
 * @example Indented
 *  await parse(`
 *    /// Main color
 *    $stardew: #ffffff
 *  `);
 */
export async function parse(
	code: string,
	options?: ParseOptions,
): Promise<Array<ParseResult>> {
	const parser = new Parser(options?.parserConfig);
	return await parser.parseString(code, options);
}

/**
 * Try to parse any SassDoc in the input
 *
 * @example
 *  parseSync(`
 *    /// Main color
 *    $stardew: #ffffff;
 *  `);
 * @example Indented
 *  parseSync(`
 *    /// Main color
 *    $stardew: #ffffff
 *  `);
 */
export function parseSync(
	code: string,
	options?: ParseOptions,
): Array<ParseResult> {
	const parser = new Parser(options?.parserConfig);
	return parser.parseStringSync(code, options);
}
