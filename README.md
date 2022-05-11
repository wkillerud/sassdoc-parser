# scss-sassdoc-parser

A more lightweight parser for SassDoc.

More or less a thin wrapper around `scss-comment-parser`, but with all SassDoc annotations and TypeScript definitions built in.

## Usage

You can parse either by passing a path to an SCSS file, or by passing in SCSS code directly.

### Parse using paths

**Single path**

```ts
import { path } from "path";
import { parse } from "scss-sassdoc-parser";

async function doParse() {
  const result = const result = await parse(
    path.join(__dirname, "_helpers.scss"),
  );
}

doParse();
```

**Multiple paths**

```ts
import { path } from "path";
import { parse } from "scss-sassdoc-parser";

async function doParse() {
  const result = const result = await parse([
    path.join(__dirname, "_mixins.scss"),
    path.join(__dirname, "_functions.scss"),
  ]);
}

doParse();
```

### Parse code strings

```ts
import { parseString } from "scss-sassdoc-parser";

async function doParse() {
  const result = await parseString(`
/// Keeps it secret
/// @output Sets display to hidden
@mixin _keep-it-secret {
  display: hidden;
}
`);

doParse();
```

## Output

The result from both parse functions is an array of [`ParseResult` (type definitions)](/src/types.ts#L87). Check out the [snapshot tests](/src/sassdoc-parser.test.ts) for some example outputs.
