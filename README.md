# sassdoc-parser

If you're looking for _just the parser_ from [sassdoc], this is it.

## Usage

```ts
import { parse } from "sassdoc-parser";

async function doParse() {
  const result = await parse("./some.scss");
}

doParse();
```
