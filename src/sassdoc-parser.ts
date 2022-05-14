import fs from "fs/promises";
import ScssCommentParser, {
  Annotations,
  ParserConfig,
} from "scss-comment-parser";
import stripIndent from "strip-indent";
import AnnotationsApi, { BuiltInAnnotationNames } from "./annotation";
import sorter from "./sorter";
import { ParseResult } from "./types";

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

  async parse(
    path: string | string[],
    id?: string,
    options: ReadFileOptions = "utf-8",
  ): Promise<ParseResult[]> {
    const paths = Array.isArray(path) ? path : [path];

    const result = await Promise.all(
      paths.map(async (src) => {
        const code = await fs.readFile(src, options);
        return await this.parseString(code, id);
      }),
    );

    return result.flat();
  }

  async parseString(code: string, id?: string): Promise<ParseResult[]> {
    let data = this.scssParser.parse(
      stripIndent(code),
      id,
    ) as Array<ParseResult>;
    data = sorter(data);

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

type ReadFileOptions =
  | ({
      encoding: BufferEncoding;
      flag?: number | string | undefined;
    } & {
      /**
       * When provided the corresponding `AbortController` can be used to cancel an asynchronous action.
       */
      signal?: AbortSignal | undefined;
    })
  | BufferEncoding;

export type ParseOptions = {
  id?: string;
  parserConfig?: ParserConfig;
  readFileOptions?: ReadFileOptions;
};

/**
 * Try to parse the SassDoc in the given file (or files)
 *
 * @example
 *  // Parse a single file
 *  const result = await parse(
 *    path.join(__dirname, "_mixins.scss"),
 *  );
 * @example
 *  // Parse multiple files
 *  const result = await parse([
 *    path.join(__dirname, "_mixins.scss"),
 *    path.join(__dirname, "_functions.scss"),
 *  ]);
 */
export async function parse(
  path: string | string[],
  options?: ParseOptions,
): Promise<Array<ParseResult>> {
  const parser = new Parser(options?.parserConfig);
  return await parser.parse(path, options?.id, options?.readFileOptions);
}

export type ParseStringOptions = {
  id?: string;
  parserConfig?: ParserConfig;
};

/**
 * Try to parse any SassDoc in the SCSS input
 *
 * @example
 *  await parseString(`
 *    /// Main color
 *    $stardew: #ffffff;
 *  `);
 */
export async function parseString(
  code: string,
  options?: ParseStringOptions,
): Promise<Array<ParseResult>> {
  const parser = new Parser(options?.parserConfig);
  return await parser.parseString(code, options?.id);
}
