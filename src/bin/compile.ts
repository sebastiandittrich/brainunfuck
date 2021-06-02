#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs/promises";
import { parse, compile as compileToBrainfuck } from "../compiler";
import { parse as parseBrainfuck } from "../interpreter/parse";
import { DirectInterpreter } from "../interpreter/DirectInterpreter";
import { optimize as optimizeBrainfuck } from "../interpreter/optimize";
import inquirer, { Question } from "inquirer";
import Base from "inquirer/lib/prompts/base";
import { Interface } from "readline";
import { CTranslator } from "../interpreter/CTranslator";

const program = new Command();

const prepare = async (path: string, options: any) => {
  const content = await fs.readFile(path).then((c) => c.toString());

  const parsed = parseBrainfuck(
    options.compiler ? compileToBrainfuck(parse(content)).code : content
  );

  if (options.optimizer) {
    optimizeBrainfuck(parsed);
  }

  if (options.benchmark) console.time("benchmark");
  return {
    parsed,
    output: (result: string) => {
      if (options.benchmark) console.timeEnd("benchmark");
      if (options.out) {
        fs.writeFile(options.out, result);
      } else {
        console.log(result);
      }
    },
  };
};

// const handle =
//   (handler: (statements: Statements, options: any) => string) =>
//   async (path: string, options: any) => {
//     console.log(program.opts());
//     const content = await fs.readFile(path).then((c) => c.toString());

//     const parsed = parseBrainfuck(
//       options.compiler ? compileToBrainfuck(parse(content)).code : content
//     );

//     if (options.optimizer) {
//       optimizeBrainfuck(parsed);
//     }

//     if (options.benchmark) console.time("benchmark");
//     const result = handler(parsed, options);
//     if (options.benchmark) console.timeEnd("benchmark");

//     if (options.out) {
//       fs.writeFile(options.out, result);
//     } else {
//       console.log(result);
//     }
//   };

inquirer.registerPrompt(
  "char",
  class extends Base {
    constructor(
      question: Question,
      readLine: Interface,
      answers: inquirer.Answers
    ) {
      super(question, readLine, answers);
    }
    onKeyPress() {
      console.log("key press!");
    }
  }
);

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
  .option("-r, --no-compiler", "run raw brainfuck code")
  .option("-s, --no-optimizer", "run raw brainfuck code")
  .option("-n, --number <numbers...>", "specify numbers")
  .option("--benchmark", "show how long this action took")
  .action(
    async (path, options) => {
      const { parsed, output } = await prepare(path, options);
      await new DirectInterpreter([]).interpret(parsed);
      output("");
    }
    // handle(async (statements, options) => {
    //   console.log(options.opts());
    //   await new DirectInterpreter(options.input?.map(parseInt)).interpret(
    //     statements
    //   );
    //   return "";
    // })
  );

// program.command("tinker").action(async () => {
//   const interpreter = new DirectInterpreter([]);
//   while (true) {
//     const { code } = await inquirer.prompt([{ name: "code", message: ">" }]);
//     interpreter.interpret(parseBrainfuck(code));
//     console.log(
//       " ",
//       String.fromCharCode((interpreter as any).currentValue),
//       "(" + (interpreter as any).currentValue + ")"
//     );
//   }
// });

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
  .action(async (path, options) => {
    const { parsed, output } = await prepare(path, options);
    if (options.language == "c++") {
      return output(new CTranslator().translate(parsed));
    }
    throw new Error("Language not supported!");
  });

program.parse(process.argv);
