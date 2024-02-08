import ScssCommentParser, {
	type Annotations,
	type ParserConfig,
} from "scss-comment-parser";
import AnnotationsApi, { type BuiltInAnnotationNames } from "./annotation.js";
import sorter from "./sorter.js";
import type { ParseResult } from "./types.js";
import { removeReduntantWhitespace } from "./utils.js";

class Parser {
	annotations: AnnotationsApi;
	scssParser: ScssCommentParser;

	constructor(parserConfig?: ParserConfig) {
		this.annotations = new AnnotationsApi();
		this.scssParser = new ScssCommentParser(
			this.annotations.list as unknown as Annotations,
			parserConfig,
		);
		this.scssParser.commentParser.on("warning", (warning: Error) => {
			console.warn(warning.message);
		});
	}

	async parseString(code: string, id?: string): Promise<ParseResult[]> {
		let data = this.scssParser.parse(
			removeReduntantWhitespace(code),
			id,
		) as Array<ParseResult>;
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
}

export type ParseOptions = {
	id?: string;
	parserConfig?: ParserConfig;
};

/**
 * Try to parse any SassDoc in the SCSS input
 *
 * @example
 *  await parse(`
 *    /// Main color
 *    $stardew: #ffffff;
 *  `);
 */
export async function parse(
	code: string,
	options?: ParseOptions,
): Promise<Array<ParseResult>> {
	const parser = new Parser(options?.parserConfig);
	return await parser.parseString(code, options?.id);
}
