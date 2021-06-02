import { isFunctionDeclaration } from "typescript";
import { ChangePointer, ChangeValue, Loop } from "./ast";
import { Interpreter } from "./Interpreter";

export class DirectInterpreter extends Interpreter<void> {
  protected band: number[] = [0];
  protected pointer: number = 0;

  constructor(public input: number[]) {
    super();
  }

  protected get currentValue() {
    return this.band[this.pointer];
  }
  protected set currentValue(value) {
    this.band[this.pointer] = value;
  }

  protected loop({ value }: Loop) {
    while (this.currentValue) {
      this.interpret(value);
    }
  }
  protected change_value({ value }: ChangeValue) {
    this.currentValue = this.currentValue + value;
  }
  protected change_pointer({ value }: ChangePointer) {
    this.pointer = this.pointer + value;
    if (this.currentValue === undefined) this.currentValue = 0;
  }
  print() {
    process.stdout.write(String.fromCharCode(this.currentValue));
  }
  read() {
    if (this.input.length < 1) throw new Error("Not enough input");
    this.currentValue = this.input[0];
    this.input = this.input.slice(1);
  }
  zero_loop() {
    if (this.currentValue < 0) throw new Error("Infinite zero loop detected!");
    this.currentValue = 0;
  }
}
