---
slug: /parser
---

# Parser

There are two main ways to use the parser:

- Give the `parse` function a path or an array of paths.
- Give the `parseString` function a string of SCSS source code.

Both functions produce the same output, which we'll get to later.

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items}/>
```
