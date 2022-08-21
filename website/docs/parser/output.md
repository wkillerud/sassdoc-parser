---
sidebar_position: 3
---

# Output

The result from both `parse` and `parseString` functions is an Array of [**`ParseResult`** (type definitions)](https://github.com/wkillerud/scss-sassdoc-parser/tree/main/src/types.ts#L87).

## Example input

```scss
/// Example trying to max out the number of annotations so we don't need so many test cases
/// @param {Number} $value - Value to add unit to
/// @param {String} $unit - String representation of the unit
/// @return {Number} - $value expressed in $unit
/// @deprecated Prefer other-item
/// @alias other-item
/// @see yet-another-item
/// @author Just Testing
/// @group helpers
/// @since 1.0.0
/// @example Add unit
///   to-length($number, "%")
@function to-length($value, $unit) {
  $units: (
    "px": 1px,
    "rem": 1rem,
    "%": 1%,
    "em": 1em,
  );
  @if not index(map-keys($units), $unit) {
    $_: log("Invalid unit #{$unit}.");
  }
  @return $value * map.get($units, $unit);
}
/// Other item
@function other-item($value) {
  @return $value;
}
/// Yet another item
@function yet-another-item($value) {
  @return $value;
}
```

## Example output

```js
[
  {
    access: "public",
    alias: "other-item",
    author: ["Just Testing"],
    commentRange: {
      end: 13,
      start: 2,
    },
    context: {
      code: `
      $units: (
        \\"px\\": 1px,
        \\"rem\\": 1rem,
        \\"%\\": 1%,
        \\"em\\": 1em,
      );
      @if not index(map-keys($units), $unit) {
          $_: log(\\"Invalid unit #{$unit}.\\");
      }
      @return $value * map.get($units, $unit);
    `,
      line: {
        end: 27,
        start: 14,
      },
      name: "to-length",
      type: "function",
    },
    deprecated: "Prefer other-item",
    description: `Example trying to max out the number of annotations so we don't need so many test cases
    `,
    example: [
      {
        code: 'to-length($number, "%")',
        description: "unit",
        type: "Add",
      },
    ],
    group: ["helpers"],
    name: "to-length",
    parameter: [
      {
        description: "Value to add unit to",
        name: "value",
        type: "Number",
      },
      {
        description: "String representation of the unit",
        name: "unit",
        type: "String",
      },
    ],
    require: [],
    return: {
      description: "$value expressed in $unit",
      type: "Number",
    },
    see: [
      {
        access: "public",
        commentRange: {
          end: 34,
          start: 34,
        },
        context: {
          code: `
      @return $value;
    `,
          line: {
            end: 37,
            start: 35,
          },
          name: "yet-another-item",
          type: "function",
        },
        description: "Yet another item",
        group: ["undefined"],
        name: "yet-another-item",
        require: [],
      },
    ],
    since: [
      {
        version: "1.0.0",
      },
    ],
  },
  {
    access: "public",
    aliased: ["to-length"],
    commentRange: {
      end: 29,
      start: 29,
    },
    context: {
      code: `
      @return $value;
    `,
      line: {
        end: 32,
        start: 30,
      },
      name: "other-item",
      type: "function",
    },
    description: "Other item",
    group: ["undefined"],
    name: "other-item",
    require: [],
  },
  {
    access: "public",
    commentRange: {
      end: 34,
      start: 34,
    },
    context: {
      code: "@return $value;",
      line: {
        end: 37,
        start: 35,
      },
      name: "yet-another-item",
      type: "function",
    },
    description: "Yet another item",
    group: ["undefined"],
    name: "yet-another-item",
    require: [],
  },
];
```

## More examples

Check out the [snapshot tests](https://github.com/wkillerud/scss-sassdoc-parser/tree/main/src/sassdoc-parser.test.ts) for more example outputs.
