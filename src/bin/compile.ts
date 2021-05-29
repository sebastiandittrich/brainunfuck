#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs/promises";
import { parse, compile as compileToBrainfuck } from "../compiler";
import { parse as parseBrainfuck } from "../interpreter/parse";
import { DirectInterpreter } from "../interpreter/DirectInterpreter";
import { optimize as optimizeBrainfuck } from "../interpreter/optimize";
import { CTranslator } from "../interpreter/CTranslator";
import { Statements } from "../interpreter/ast";

const program = new Command();

const handle =
  (handler: (statements: Statements, options: any) => string) =>
  async (path: string, options: any) => {
    const content = await fs.readFile(path).then((c) => c.toString());

    const parsed = parseBrainfuck(
      options.compiler ? compileToBrainfuck(parse(content)).code : content
    );

    if (options.optimizer) {
      optimizeBrainfuck(parsed);
    }

    if (options.benchmark) console.time("benchmark");
    const result = handler(parsed, options);
    if (options.benchmark) console.timeEnd("benchmark");

    if (options.out) {
      fs.writeFile(options.out, result);
    } else {
      console.log(result);
    }
  };

program
  .command("compile <path>")
  .option("-o, --out <outpath>", "output file path")
  .action(async (path, { out }) => {
    const content = await fs.readFile(path).then((c) => c.toString());
    const compiled = compileToBrainfuck(parse(content)).code;
    if (out) {
      fs.writeFile(out, compiled);
    } else {
      console.log(compiled);
    }
  });

program
  .command("run <path>")
  .option("-i, --input <input...>", "input characters")
  .option("-r, --no-compiler", "run raw brainfuck code")
  .option("-s, --no-optimizer", "run raw brainfuck code")
  .option("--benchmark", "show how long this action took")
  .action(
    handle((statements, options) => {
      new DirectInterpreter(options.input?.map(parseInt)).interpret(statements);
      return "";
    })
  );

program
  .command("translate <path>")
  .option("-o, --out <file>", "output file")
  .option("-r, --no-compiler", "run raw brainfuck code")
  .option("-s, --no-optimizer", "run raw brainfuck code")
  .option(
    "-l, --language <language>",
    "the language to that the code should be translated"
  )
  .option("--benchmark", "show how long this action took")
  .action(
    handle((statements, options) => {
      if (options.language == "c++") {
        return new CTranslator().translate(statements);
      }
      throw new Error("Language not supported!");
    })
  );

program.parse(process.argv);
