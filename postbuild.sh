#!/usr/bin/env bash

cat >dist/cjs/package.json <<!EOF
{
  "version": "$(node -p 'require("./package.json").version')",
  "type": "commonjs"
}
!EOF

cat >dist/esm/package.json <<!EOF
{
  "version": "$(node -p 'require("./package.json").version')",
  "type": "module"
}
!EOF
