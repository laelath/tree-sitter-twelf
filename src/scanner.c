#include "tree_sitter/parser.h"
#include <wctype.h>

enum TokenType {
  BLOCK_COMMENT,
};

void *tree_sitter_twelf_external_scanner_create() { return NULL; }
void tree_sitter_twelf_external_scanner_destroy(void *p) {}
void tree_sitter_twelf_external_scanner_reset(void *p) {}
unsigned tree_sitter_twelf_external_scanner_serialize(void *p, char *buffer) { return 0; }
void tree_sitter_twelf_external_scanner_deserialize(void *p, const char *b, unsigned n) {}

bool tree_sitter_twelf_external_scanner_scan(void *payload, TSLexer *lexer,
                                             const bool *valid_symbols) {
  while (iswspace(lexer->lookahead)) lexer->advance(lexer, true);

  if (lexer->lookahead == '%') {
    lexer->advance(lexer, false);
    if (lexer->lookahead != '{') return false;
    lexer->advance(lexer, false);

    bool after_close = false;
    unsigned nesting_depth = 1;
    while (true) {
      if (lexer->eof(lexer)) return false;
      switch (lexer->lookahead) {
        case '}':
          lexer->advance(lexer, false);
          after_close = true;
          break;
        case '%':
          if (after_close) {
            lexer->advance(lexer, false);
            after_close = false;
            nesting_depth--;
            if (nesting_depth == 0) {
              lexer->result_symbol = BLOCK_COMMENT;
              return true;
            }
          } else {
            lexer->advance(lexer, false);
            after_close = false;
            if (lexer->lookahead == '{') {
              nesting_depth++;
              lexer->advance(lexer, false);
            }
          }
          break;
        default:
          lexer->advance(lexer, false);
          after_close = false;
          break;
      }
    }
  }

  return false;
}
