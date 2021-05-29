import { Statements } from "./ast";

const { Parser, Grammar } = require("nearley");
const grammar = Grammar.fromCompiled(require("../../brainfuck"));

export const parse = (code: string): Statements => {
  const parser = new Parser(grammar);
  parser.feed(code.replace(/[^\+\-\[\]\.\,\<\>]/g, ""));
  return parser.results[0];
};
