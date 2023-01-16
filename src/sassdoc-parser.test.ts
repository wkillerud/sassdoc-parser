import path from "path";
import { parse, parseString } from "./sassdoc-parser";

test("parses a decked out function", async () => {
  const result = await parseString(/* scss */ `
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
`);

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "access": "public",
        "alias": "other-item",
        "author": [
          "Just Testing",
        ],
        "commentRange": {
          "end": 13,
          "start": 2,
        },
        "context": {
          "code": "
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
    ",
          "line": {
            "end": 27,
            "start": 14,
          },
          "name": "to-length",
          "type": "function",
        },
        "deprecated": "Prefer other-item",
        "description": "Example trying to max out the number of annotations so we don't need so many test cases
    ",
        "example": [
          {
            "code": "to-length($number, "%")",
            "description": "unit",
            "type": "Add",
          },
        ],
        "group": [
          "helpers",
        ],
        "name": "to-length",
        "parameter": [
          {
            "description": "Value to add unit to",
            "name": "value",
            "type": "Number",
          },
          {
            "description": "String representation of the unit",
            "name": "unit",
            "type": "String",
          },
        ],
        "require": [],
        "return": {
          "description": "$value expressed in $unit",
          "type": "Number",
        },
        "see": [
          {
            "access": "public",
            "commentRange": {
              "end": 34,
              "start": 34,
            },
            "context": {
              "code": "
      @return $value;
    ",
              "line": {
                "end": 37,
                "start": 35,
              },
              "name": "yet-another-item",
              "type": "function",
            },
            "description": "Yet another item
    ",
            "group": [
              "undefined",
            ],
            "name": "yet-another-item",
            "require": [],
          },
        ],
        "since": [
          {
            "version": "1.0.0",
          },
        ],
      },
      {
        "access": "public",
        "aliased": [
          "to-length",
        ],
        "commentRange": {
          "end": 29,
          "start": 29,
        },
        "context": {
          "code": "
      @return $value;
    ",
          "line": {
            "end": 32,
            "start": 30,
          },
          "name": "other-item",
          "type": "function",
        },
        "description": "Other item
    ",
        "group": [
          "undefined",
        ],
        "name": "other-item",
        "require": [],
      },
      {
        "access": "public",
        "commentRange": {
          "end": 34,
          "start": 34,
        },
        "context": {
          "code": "
      @return $value;
    ",
          "line": {
            "end": 37,
            "start": 35,
          },
          "name": "yet-another-item",
          "type": "function",
        },
        "description": "Yet another item
    ",
        "group": [
          "undefined",
        ],
        "name": "yet-another-item",
        "require": [],
      },
    ]
  `);
});

test("parses a decked out variable", async () => {
  const result = await parseString(/* scss */ `
/// Example trying to max out the number of annotations so we don't need so many test cases
/// @access public
/// @deprecated Prefer valley
/// @alias stardew-alias
/// @see {variable} valley
/// @author Just Testing
/// @group tokens
/// @since 1.0.0
/// @example
///   font-color: $stardew;
$stardew: #ffffff;

/// @todo Document me
$stardew-alias: #fcfcfc;

/// @todo Document me
$valley: #000000;
`);

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "access": "public",
        "alias": "stardew-alias",
        "author": [
          "Just Testing",
        ],
        "commentRange": {
          "end": 11,
          "start": 2,
        },
        "context": {
          "line": {
            "end": 12,
            "start": 12,
          },
          "name": "stardew",
          "scope": "private",
          "type": "variable",
          "value": "#ffffff",
        },
        "deprecated": "Prefer valley",
        "description": "Example trying to max out the number of annotations so we don't need so many test cases
    ",
        "example": [
          {
            "code": "font-color: $stardew;",
            "type": "scss",
          },
        ],
        "group": [
          "tokens",
        ],
        "name": "stardew",
        "see": [
          {
            "access": "public",
            "commentRange": {
              "end": 17,
              "start": 17,
            },
            "context": {
              "line": {
                "end": 18,
                "start": 18,
              },
              "name": "valley",
              "scope": "private",
              "type": "variable",
              "value": "#000000",
            },
            "description": "",
            "group": [
              "undefined",
            ],
            "name": "valley",
            "todo": [
              "Document me",
            ],
          },
        ],
        "since": [
          {
            "version": "1.0.0",
          },
        ],
      },
      {
        "access": "public",
        "aliased": [
          "stardew",
        ],
        "commentRange": {
          "end": 14,
          "start": 14,
        },
        "context": {
          "line": {
            "end": 15,
            "start": 15,
          },
          "name": "stardew-alias",
          "scope": "private",
          "type": "variable",
          "value": "#fcfcfc",
        },
        "description": "",
        "group": [
          "undefined",
        ],
        "name": "stardew-alias",
        "todo": [
          "Document me",
        ],
      },
      {
        "access": "public",
        "commentRange": {
          "end": 17,
          "start": 17,
        },
        "context": {
          "line": {
            "end": 18,
            "start": 18,
          },
          "name": "valley",
          "scope": "private",
          "type": "variable",
          "value": "#000000",
        },
        "description": "",
        "group": [
          "undefined",
        ],
        "name": "valley",
        "todo": [
          "Document me",
        ],
      },
    ]
  `);
});

test("parses a decked out mixin", async () => {
  const result = await parseString(/* scss */ `
/// Keeps it secret
/// @output Sets display to hidden
@mixin _keep-it-secret {
  display: hidden;
}

/// Keeps it safe
/// @content Wraps in media query for print
@mixin _keep-it-safe {
  @media print {
    @content;
  }
}

/// Where is the ring?
/// @param {String} $where [here] - Tell us where it is
@mixin _ring-is($where: "here") {
  content: $where;
}
`);

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "access": "private",
        "commentRange": {
          "end": 3,
          "start": 2,
        },
        "context": {
          "code": "
      display: hidden;
    ",
          "line": {
            "end": 6,
            "start": 4,
          },
          "name": "_keep-it-secret",
          "type": "mixin",
        },
        "description": "Keeps it secret
    ",
        "group": [
          "undefined",
        ],
        "name": "_keep-it-secret",
        "output": "Sets display to hidden",
      },
      {
        "access": "private",
        "commentRange": {
          "end": 9,
          "start": 8,
        },
        "content": "Wraps in media query for print",
        "context": {
          "code": "
      @media print {
        @content;
      }
    ",
          "line": {
            "end": 14,
            "start": 10,
          },
          "name": "_keep-it-safe",
          "type": "mixin",
        },
        "description": "Keeps it safe
    ",
        "group": [
          "undefined",
        ],
        "name": "_keep-it-safe",
      },
      {
        "access": "private",
        "commentRange": {
          "end": 17,
          "start": 16,
        },
        "context": {
          "code": "
      content: $where;
    ",
          "line": {
            "end": 20,
            "start": 18,
          },
          "name": "_ring-is",
          "type": "mixin",
        },
        "description": "Where is the ring?
    ",
        "group": [
          "undefined",
        ],
        "name": "_ring-is",
        "parameter": [
          {
            "default": "here",
            "description": "Tell us where it is",
            "name": "where",
            "type": "String",
          },
        ],
        "require": [],
      },
    ]
  `);
});

test("reads things from a path", async () => {
  const result = await parse(
    path.join(__dirname, "sassdoc-parser.fixture.scss"),
  );

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "access": "public",
        "commentRange": {
          "end": 1,
          "start": 1,
        },
        "context": {
          "line": {
            "end": 2,
            "start": 2,
          },
          "name": "valley",
          "scope": "private",
          "type": "variable",
          "value": "#000000",
        },
        "description": "",
        "group": [
          "undefined",
        ],
        "name": "valley",
        "todo": [
          "Document me",
        ],
      },
    ]
  `);
});

test("reads things from an array of paths", async () => {
  const result = await parse([
    path.join(__dirname, "sassdoc-parser.fixture.scss"),
    path.join(__dirname, "sassdoc-parser-two.fixture.scss"),
  ]);

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "access": "public",
        "commentRange": {
          "end": 1,
          "start": 1,
        },
        "context": {
          "line": {
            "end": 2,
            "start": 2,
          },
          "name": "valley",
          "scope": "private",
          "type": "variable",
          "value": "#000000",
        },
        "description": "",
        "group": [
          "undefined",
        ],
        "name": "valley",
        "todo": [
          "Document me",
        ],
      },
      {
        "access": "public",
        "commentRange": {
          "end": 1,
          "start": 1,
        },
        "context": {
          "line": {
            "end": 2,
            "start": 2,
          },
          "name": "stardew",
          "scope": "private",
          "type": "variable",
          "value": "#000000",
        },
        "description": "",
        "group": [
          "undefined",
        ],
        "name": "stardew",
        "todo": [
          "Document me",
        ],
      },
    ]
  `);
});

test("gives a default name that can be overridden with the @name annotation", async () => {
  const result = await parseString(/* scss */ `
/// This is a test
$primary-color: #000000;

/// This is a test
/// @name wants-to-be-the-primary-color
$secondary-color: #000000;
`);
  expect(result[0].name).toEqual("primary-color");
  expect(result[1].name).toEqual("wants-to-be-the-primary-color");
  expect(result[1].context.name).toEqual("secondary-color");
});
