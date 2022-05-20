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
    Array [
      Object {
        "access": "public",
        "alias": "other-item",
        "author": Array [
          "Just Testing",
        ],
        "commentRange": Object {
          "end": 13,
          "start": 2,
        },
        "context": Object {
          "code": "
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
    ",
          "line": Object {
            "end": 27,
            "start": 14,
          },
          "name": "to-length",
          "type": "function",
        },
        "deprecated": "Prefer other-item",
        "description": "Example trying to max out the number of annotations so we don't need so many test cases
    ",
        "example": Array [
          Object {
            "code": "to-length($number, \\"%\\")",
            "description": "unit",
            "type": "Add",
          },
        ],
        "group": Array [
          "helpers",
        ],
        "name": "to-length",
        "parameter": Array [
          Object {
            "description": "Value to add unit to",
            "name": "value",
            "type": "Number",
          },
          Object {
            "description": "String representation of the unit",
            "name": "unit",
            "type": "String",
          },
        ],
        "require": Array [],
        "return": Object {
          "description": "$value expressed in $unit",
          "type": "Number",
        },
        "see": Array [
          Object {
            "access": "public",
            "commentRange": Object {
              "end": 34,
              "start": 34,
            },
            "context": Object {
              "code": "
      @return $value;
    ",
              "line": Object {
                "end": 37,
                "start": 35,
              },
              "name": "yet-another-item",
              "type": "function",
            },
            "description": "Yet another item
    ",
            "group": Array [
              "undefined",
            ],
            "name": "yet-another-item",
            "require": Array [],
          },
        ],
        "since": Array [
          Object {
            "version": "1.0.0",
          },
        ],
      },
      Object {
        "access": "public",
        "aliased": Array [
          "to-length",
        ],
        "commentRange": Object {
          "end": 29,
          "start": 29,
        },
        "context": Object {
          "code": "
      @return $value;
    ",
          "line": Object {
            "end": 32,
            "start": 30,
          },
          "name": "other-item",
          "type": "function",
        },
        "description": "Other item
    ",
        "group": Array [
          "undefined",
        ],
        "name": "other-item",
        "require": Array [],
      },
      Object {
        "access": "public",
        "commentRange": Object {
          "end": 34,
          "start": 34,
        },
        "context": Object {
          "code": "
      @return $value;
    ",
          "line": Object {
            "end": 37,
            "start": 35,
          },
          "name": "yet-another-item",
          "type": "function",
        },
        "description": "Yet another item
    ",
        "group": Array [
          "undefined",
        ],
        "name": "yet-another-item",
        "require": Array [],
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
    Array [
      Object {
        "access": "public",
        "alias": "stardew-alias",
        "author": Array [
          "Just Testing",
        ],
        "commentRange": Object {
          "end": 11,
          "start": 2,
        },
        "context": Object {
          "line": Object {
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
        "example": Array [
          Object {
            "code": "font-color: $stardew;",
            "type": "scss",
          },
        ],
        "group": Array [
          "tokens",
        ],
        "name": "stardew",
        "see": Array [
          Object {
            "access": "public",
            "commentRange": Object {
              "end": 17,
              "start": 17,
            },
            "context": Object {
              "line": Object {
                "end": 18,
                "start": 18,
              },
              "name": "valley",
              "scope": "private",
              "type": "variable",
              "value": "#000000",
            },
            "description": "",
            "group": Array [
              "undefined",
            ],
            "name": "valley",
            "todo": Array [
              "Document me",
            ],
          },
        ],
        "since": Array [
          Object {
            "version": "1.0.0",
          },
        ],
      },
      Object {
        "access": "public",
        "aliased": Array [
          "stardew",
        ],
        "commentRange": Object {
          "end": 14,
          "start": 14,
        },
        "context": Object {
          "line": Object {
            "end": 15,
            "start": 15,
          },
          "name": "stardew-alias",
          "scope": "private",
          "type": "variable",
          "value": "#fcfcfc",
        },
        "description": "",
        "group": Array [
          "undefined",
        ],
        "name": "stardew-alias",
        "todo": Array [
          "Document me",
        ],
      },
      Object {
        "access": "public",
        "commentRange": Object {
          "end": 17,
          "start": 17,
        },
        "context": Object {
          "line": Object {
            "end": 18,
            "start": 18,
          },
          "name": "valley",
          "scope": "private",
          "type": "variable",
          "value": "#000000",
        },
        "description": "",
        "group": Array [
          "undefined",
        ],
        "name": "valley",
        "todo": Array [
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
    Array [
      Object {
        "access": "private",
        "commentRange": Object {
          "end": 3,
          "start": 2,
        },
        "context": Object {
          "code": "
      display: hidden;
    ",
          "line": Object {
            "end": 6,
            "start": 4,
          },
          "name": "_keep-it-secret",
          "type": "mixin",
        },
        "description": "Keeps it secret
    ",
        "group": Array [
          "undefined",
        ],
        "name": "_keep-it-secret",
        "output": "Sets display to hidden",
      },
      Object {
        "access": "private",
        "commentRange": Object {
          "end": 9,
          "start": 8,
        },
        "content": "Wraps in media query for print",
        "context": Object {
          "code": "
      @media print {
        @content;
      }
    ",
          "line": Object {
            "end": 14,
            "start": 10,
          },
          "name": "_keep-it-safe",
          "type": "mixin",
        },
        "description": "Keeps it safe
    ",
        "group": Array [
          "undefined",
        ],
        "name": "_keep-it-safe",
      },
      Object {
        "access": "private",
        "commentRange": Object {
          "end": 17,
          "start": 16,
        },
        "context": Object {
          "code": "
      content: $where;
    ",
          "line": Object {
            "end": 20,
            "start": 18,
          },
          "name": "_ring-is",
          "type": "mixin",
        },
        "description": "Where is the ring?
    ",
        "group": Array [
          "undefined",
        ],
        "name": "_ring-is",
        "parameter": Array [
          Object {
            "default": "here",
            "description": "Tell us where it is",
            "name": "where",
            "type": "String",
          },
        ],
        "require": Array [],
      },
    ]
  `);
});

test("reads things from a path", async () => {
  const result = await parse(
    path.join(__dirname, "sassdoc-parser.fixture.scss"),
  );

  expect(result).toMatchInlineSnapshot(`
    Array [
      Object {
        "access": "public",
        "commentRange": Object {
          "end": 1,
          "start": 1,
        },
        "context": Object {
          "line": Object {
            "end": 2,
            "start": 2,
          },
          "name": "valley",
          "scope": "private",
          "type": "variable",
          "value": "#000000",
        },
        "description": "",
        "group": Array [
          "undefined",
        ],
        "name": "valley",
        "todo": Array [
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
    Array [
      Object {
        "access": "public",
        "commentRange": Object {
          "end": 1,
          "start": 1,
        },
        "context": Object {
          "line": Object {
            "end": 2,
            "start": 2,
          },
          "name": "valley",
          "scope": "private",
          "type": "variable",
          "value": "#000000",
        },
        "description": "",
        "group": Array [
          "undefined",
        ],
        "name": "valley",
        "todo": Array [
          "Document me",
        ],
      },
      Object {
        "access": "public",
        "commentRange": Object {
          "end": 1,
          "start": 1,
        },
        "context": Object {
          "line": Object {
            "end": 2,
            "start": 2,
          },
          "name": "stardew",
          "scope": "private",
          "type": "variable",
          "value": "#000000",
        },
        "description": "",
        "group": Array [
          "undefined",
        ],
        "name": "stardew",
        "todo": Array [
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
