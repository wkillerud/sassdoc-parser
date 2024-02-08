# scss-sassdoc-parser

A more lightweight parser for SassDoc.

More or less a thin wrapper around `scss-comment-parser`, but with all SassDoc annotations and TypeScript definitions built in.

## Usage

```ts
import { parse } from "scss-sassdoc-parser";

async function doParse() {
  const result = await parse(`
/// Keeps it secret
/// @output Sets display to hidden
@mixin _keep-it-secret {
  display: hidden;
}
`);

doParse();
```

### Parse using paths

```ts
import fs from "node:fs/promises";
import { parse } from "scss-sassdoc-parser";

export async function doParse(path: string | string[]): Promise<ParseResult[]> {
	const paths = Array.isArray(path) ? path : [path];
	const result = await Promise.all(
		paths.map(async (src) => {
			const code = await fs.readFile(src, "utf-8");
			return await parse(code);
		}),
	);
	return result.flat();
}

const singlePathResult = await doParse("_helpers.scss");
const arrayOfPathsResult = await doParse(["_mixins.scss", "_functions.scss"]);
```

## Output

The result from the `parse` function is an array of [`ParseResult` (type definitions)](/src/types.ts#L87). Check out the [snapshot tests](/src/sassdoc-parser.test.ts) for some example outputs.
