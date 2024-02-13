(tm_type) @type
(tm_app . (id) @function)
((id) @variable.parameter
 (#match? @variable.parameter "^[A-Z_].*"))
(id) @variable
(anon) @variable

(tm_pi ["{" "}"] @constructor)
(tm_lam ["[" "]"] @constructor)

[
  "%abbrev"
  "%define"
  "%solve"
  "%mode"
  "%block"
  "%worlds"
  "%total"
  "%freeze"
  "%name"
] @keyword

(keyword) @keyword

[
  "."
  "|"
] @punctuation.delimiter

[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

[
  "->"
  "<-"
  ":"
  "="
] @operator

(line_comment) @comment.line
(block_comment) @comment.block
