---
sidebar_position: 2
---

# Parse strings

The `parseString` function expects a string of valid SCSS code. The output is the same as `parse`.

```js
import { parseString } from "scss-sassdoc-parser";

async function doParse() {
  const result = await parseString(`
/// Keeps it secret
/// @output Sets display to hidden
@mixin _keep-it-secret {
  display: hidden;
}
`);
}

doParse();
```
