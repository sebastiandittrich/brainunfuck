import {
  ChangePointer,
  ChangeValue,
  Loop,
  Print,
  Read,
  Statements,
  ZeroLoop,
} from "./ast";

export abstract class Interpreter<Type = any> {
  public interpret(statements: Statements): Type[] {
    return statements.map((statement) =>
      (this[statement.type] as any)(statement)
    );
  }

  protected abstract loop(o: Loop): Type;
  protected abstract change_value(o: ChangeValue): Type;
  protected abstract change_pointer(o: ChangePointer): Type;
  protected abstract print(o: Print): Type;
  protected abstract read(o: Read): Type;
  protected abstract zero_loop(o: ZeroLoop): Type;
}
