---
sidebar_position: 1
---

# Parse files

The `parse` function expects a single path or an Array of paths. The parser does **not follow imports**. You'll have to include all relevant paths yourself.

## Single path

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

## Multiple paths

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
