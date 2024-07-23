# scss-sassdoc-parser

A lightweight parser for SassDoc.

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

Or sync

```ts
import { parseSync } from "scss-sassdoc-parser";

const result = parseSync(`
/// Keeps it secret
/// @output Sets display to hidden
@mixin _keep-it-secret {
  display: hidden;
}
`);
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

### Indented syntax

The parser can handle indented syntax with a caveat:

- The `context` field will not include accurate `code` or `line` fields.

```js
import { parseSync } from "scss-sassdoc-parser";

const result = parseSync(
	`
/// Converts a value to the given unit
/// @param {Number} $value - Value to add unit to
/// @param {String} $unit - String representation of the unit
/// @return {Number} - $value expressed in $unit
@function to-length($value, $unit)
	$units: (
		"px": 1px,
		"rem": 1rem,
		"%": 1%,
		"em": 1em,
	)

	@if not index(map-keys($units), $unit)
			$_: log("Invalid unit #{$unit}.")

	@return $value * map.get($units, $unit)
`,
);
```

## Output

The result from the `parse` function is an array of [`ParseResult` (type definitions)](/src/types.ts#L87). Check out the snapshot for some example outputs:

- [Example output for SCSS](/src/sassdoc-parser.test.ts)
- [Example output for indented](/src/sassdoc-parser-indented.test.ts)

## Advanced usage

If you're running this parser on a hot code path, you might discover a noticable time is spent constructing the `Parser` class. The `parse` and `parseSync` methods create a new instance of this parser for each invocation. To reuse the same parser instance,
import the `Parser` class and use that instead.

```js
import { Parser } from "sassdoc-parser";

const parser = new Parser();

const result = await parser.parseString(`
/// Keeps it secret
/// @output Sets display to hidden
@mixin _keep-it-secret {
  display: hidden;
}
`);

const syncResult = parser.parseStringSync(`
/// Keeps it secret
/// @output Sets display to hidden
@mixin _keep-it-secret {
  display: hidden;
}
`);
```
