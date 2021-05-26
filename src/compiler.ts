import nearley from "nearley";
import grammar from "../brainunfuck.js";
import { BString, Char, Environment, Field, Int } from "./generator";

const astToBrainfuck = (environment: Environment, vars: Map<string, Field>) => {
  const astToBrainfuck = (ast: any): any => {
    if (ast.type == "int") {
      return new Int(environment).setInt(ast.value);
    }
    if (ast.type == "char") {
      return new Char(environment).setChar(ast.value);
    }
    if (ast.type == "string") {
      return new BString(environment, ast.value);
    }
    if (ast.type == "additive_expression") {
      if (ast.operation == "+") {
        return astToBrainfuck(ast.left).clone().add(astToBrainfuck(ast.right));
      }
      if (ast.operation == "-") {
        return astToBrainfuck(ast.left)
          .clone()
          .subtract(astToBrainfuck(ast.right));
      }
    }
    if (ast.type == "read") {
      return new Field(environment).input();
    }
    if (ast.type == "print_statement") {
      return astToBrainfuck(ast.value).print();
    }
    if (ast.type == "if_statement") {
      environment.executeIf(astToBrainfuck(ast.condition), () => {
        astToBrainfuck(ast.code);
      });
      return null;
    }
    if (ast.type == "while_statement") {
      environment.executeWhile(astToBrainfuck(ast.condition), () => {
        astToBrainfuck(ast.code);
      });
      return null;
    }
    if (ast.type == "code_block") {
      for (const statement of ast.value) {
        astToBrainfuck(statement);
      }
      return null;
    }
    if (ast.type == "var_initialisation") {
      if (ast.var_type == "int") {
        vars.set(ast.variable.name, new Int(environment));
      }
      if (ast.var_type == "char") {
        vars.set(ast.variable.name, new Char(environment));
      }
      return null;
    }
    if (ast.type == "var_assignment") {
      astToBrainfuck(ast.value).copy(vars.get(ast.variable.name));
      return null;
    }
    if (ast.type == "var_reference") {
      return vars.get(ast.name);
    }
  };
  return astToBrainfuck;
};

export const compile = (ast: any) => {
  const vars = new Map<string, Field>();
  const environment = new Environment();

  astToBrainfuck(environment, vars)(ast);

  return environment;
};

export const parse = (code: string) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(code);
  return parser.results[0];
};

// console.log(code.value);
// interpret(code.value, ["A".charCodeAt()]); // 2 -> 1 (A)
// console.log();
// interpret(code.value, ["B".charCodeAt()]); // 3 -> 2 (B)
// console.log();
// interpret(code.value, ["C".charCodeAt()]); // 4 -> 3 (C)
// console.log();
// interpret(code.value, ["D".charCodeAt()]); // 5 -> 5 (E)
// console.log();
// interpret(code.value, ["E".charCodeAt()]); // 6 -> 8 (H)
// console.log();
// interpret(code.value, ["F".charCodeAt()]); // 7 -> 13 (M)
