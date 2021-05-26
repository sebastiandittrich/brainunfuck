#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs/promises";
import { parse, compile } from "../compiler";
import { interpret } from "../interpreter";

const program = new Command();

program
  .command("compile <path>")
  .option("-o, --out <outpath>", "output file path")
  .action(async (path, { out }) => {
    const content = await fs.readFile(path).then((c) => c.toString());
    const compiled = compile(parse(content)).code;
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
  .action(async (path, { input, compiler }) => {
    const content = await fs.readFile(path).then((c) => c.toString());
    const compiled = compiler ? compile(parse(content)).code : content;
    interpret(compiled, input?.map(parseInt));
  });

program.parse(process.argv);
