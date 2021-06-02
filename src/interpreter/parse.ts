import { restoreDefaultPrompts } from "inquirer";
import { Statements } from "./ast";

const { Parser, Grammar } = require("nearley");
const grammar = Grammar.fromCompiled(require("../../brainfuck"));

export const parseSlow = (code: string): Statements => {
  const parser = new Parser(grammar);
  parser.feed(code.replace(/[^\+\-\[\]\.\,\<\>]/g, ""));
  return parser.results[0];
};

function getEndingIndex(code: string, index: number) {
  var depth = 0;
  while (true) {
    if (code[index] == "[") {
      depth++;
    }
    if (code[index] == "]") {
      depth--;
      if (depth < 1) {
        return index;
      }
    }
    index++;
  }
}

export const parse = (code: string, d: number = 0) => {
  let index = 0;
  const statements: Statements = [];
  while (index < code.length) {
    switch (code[index]) {
      case "+":
        statements.push({ type: "change_value", value: 1 });
        break;
      case "-":
        statements.push({ type: "change_value", value: -1 });
        break;
      case ">":
        statements.push({ type: "change_pointer", value: 1 });
        break;
      case "<":
        statements.push({ type: "change_pointer", value: -1 });
        break;
      case ".":
        statements.push({ type: "print" });
        break;
      case ",":
        statements.push({ type: "read" });
        break;
      case "[":
        const ending = getEndingIndex(code, index);
        statements.push({
          type: "loop",
          value: parse(code.slice(index + 1, ending), d + 1),
        });
        index = ending;
        break;
      case "]":
        throw new Error("Something went wrong");

      default:
        break;
    }
    index++;
    // console.log("index", index, code[index], code.length);
  }
  //   console.log("done depth", d);
  return statements;
};
