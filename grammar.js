module.exports = grammar({
  name: 'twelf',

  extras: $ => [
    /\s/, '\n', '\r',
    $.comment
  ],

  rules: {
    source_file: $ => repeat($._declaration),

    _declaration: $ => seq(choice(
      $.decl,
      $.defn,
      $.solve_decl,
      $.mode_decl,
      $.worlds_decl,
      $.total_decl,
    ), '.'),

    decl: $ => seq(
      choice(alias('_', $.anon), $.id),
      ':',
      $._term),

    defn: $ => seq(
      $.id,
      optional(seq(':', $._term)), '=', $._term
    ),

    solve_decl: $ => seq(
      '%solve',
      choice(alias('_', $.anon), $.id),
      ':',
      $._term,
    ),

    tm_fun: $ => choice(
      prec.right(1, seq(field('from', $._term), '->', field('to', $._term))),
      prec.left(1, seq(field('to', $._term), '<-', field('from', $._term)))
    ),
    tm_pi: $ => seq(
      '{', $.id, optional(seq(':', $._term)), '}',
      $._term
    ),
    tm_lam: $ => seq(
      '[', $.id, optional(seq(':', $._term)), ']',
      $._term
    ),
    tm_app: $ => prec.left(2, seq($._term, $._term)),
    tm_ascrip: $ => prec.left(1, seq($._term, ':', $._term)),

    tm_bracket: $ => seq('(', $._term, ')'),

    _term: $ => choice(
      alias('type', $.tm_type),
      alias('_', $.tm_hole),
      $.id,
      $.tm_fun,
      $.tm_pi,
      $.tm_lam,
      $.tm_app,
      $.tm_ascrip,
      $.tm_bracket,
    ),

    mode: $ => choice('+', '*', '-'),
    mid: $ => seq($.mode, $.id),

    mode_decl: $ => seq(
      '%mode',
      choice(
        seq($.id, repeat($.mid)),
        seq(
          repeat1(seq(
            '{',
            $.mode,
            choice($.id, seq($.id, ':', $._term)),
            '}')),
          $.id, repeat($.id)
        ),
      )
    ),

    callpat: $ => seq($.id, repeat(choice(alias('_', $.anon), $.id))),

    order: $ => choice(
      choice($.id, seq('(', repeat($.id), ')')),
      seq('{', repeat($.order), '}'),
      seq('[', repeat($.order), ']'),
    ),

    total_decl: $ => seq(
      '%total',
      $.order,
      repeat(seq('(', $.callpat, ')')),
    ),

    worlds_decl: $ => seq(
      '%worlds',
      '(',
      optional(seq($.id, repeat(seq('|', $.id)))),
      ')',
      repeat(seq('(', $.callpat, ')')),
    ),

    comment: $ => token(choice(
      /%\n/,
      seq(/%[% \t]/, /.*/)
    )),

    id: $ => /[^\s:.()\[\]{}%"]+/,
  }
});
