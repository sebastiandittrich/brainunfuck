import { ChangePointer, ChangeValue, Loop, Statements } from "./ast";
import { Interpreter } from "./Interpreter";

export class CTranslator extends Interpreter<string> {
  public translate(statements: Statements) {
    return `
        #include <iostream>

        int main() {
            char band[30000];
            for (char &data : band)
            {
                data = 0;
            }
            char *pointer = band;
            ${this.interpret(statements).join(";")};
        }
    `;
  }

  protected loop({ value }: Loop) {
    return `
        while (*pointer != 0) {
            ${this.interpret(value).join(";")}
        }
    `;
  }
  protected change_value({ value }: ChangeValue) {
    return `*pointer += ${value};`;
  }
  protected change_pointer({ value }: ChangePointer) {
    return `pointer += ${value};`;
  }
  print() {
    return `std::cout << *pointer;`;
  }
  read() {
    return ` std::cin >> *pointer `;
  }
  zero_loop() {
    return `if (*pointer < 0) throw "Infinite zero loop detected!"; *pointer = 0;`;
  }
}
