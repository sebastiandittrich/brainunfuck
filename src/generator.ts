export class Field {
  protected index: number = this.environment.allocateIndex();
  constructor(protected environment: Environment) {}

  focus() {
    this.environment.focusIndex(this.index);
    return this;
  }

  execute(code: string, comment?: string) {
    this.focus();
    this.environment.execute(code, comment);
    return this;
  }

  reset() {
    return this.execute("[-]", "Reset field to 0");
  }

  set(value: number) {
    this.reset();
    if (value > 0) this.execute("+".repeat(value), "Set to " + value);
    else if (value < 0) this.execute("-".repeat(value), "Set to " + value);
    return this;
  }

  setInt(int: number) {
    return this.set(int);
  }
  setChar(char: string) {
    return this.set(char.charCodeAt(0));
  }
  setBool(bool: boolean) {
    return this.setInt(bool ? 1 : 0);
  }
  input() {
    return this.execute(",");
  }
  move(...others: Field[]) {
    for (const other of others) {
      other.reset();
    }
    this.environment.executeWhile(this, () => {
      for (const other of others) {
        other.execute("+");
      }
      this.execute("-");
    });
    return this;
  }
  copy(...other: Field[]) {
    const intermediate = new Field(this.environment);
    this.move(intermediate);
    intermediate.move(this, ...other);
    return this;
  }
  print() {
    return this.execute(".");
  }
  clone(): this {
    const n = new (this.constructor as any)();
    this.copy(n);
    return n;
  }
}

export class Int extends Field {
  subtract(other: Field) {
    const intermediate = new Field(this.environment);
    other.copy(intermediate);
    intermediate.execute("[");
    this.execute("-");
    intermediate.execute("-]");
    return this;
  }
  add(other: Field) {
    const intermediate = new Field(this.environment);
    other.copy(intermediate);
    intermediate.execute("[");
    this.execute("+");
    intermediate.execute("-]");
    return this;
  }
  multiply(other: Field) {
    const intermediateMultiplier = other.clone();
    const intermediateThis = this.clone();
    this.reset();
    this.environment.executeWhile(intermediateMultiplier, () => {
      this.add(intermediateThis);
      intermediateMultiplier.execute("-");
    });
    return this;
  }
}

export class Char extends Field {}

export class BArray {
  constructor(public environment: Environment, public items: Field[]) {
    this.items = items;
  }
  print() {
    new Char(this.environment).setChar("[").print();
    for (const item of this.items) {
      item.print();
      new Char(this.environment).setChar(",").print();
    }
    new Char(this.environment).setChar("]").print();
  }
}

export class BString extends BArray {
  constructor(public environment: Environment, string: string) {
    super(
      environment,
      string.split("").map((char) => new Char(environment).setChar(char))
    );
  }
  input() {
    for (const item of this.items) {
      item.input();
    }
  }
  print() {
    for (const item of this.items) {
      item.print();
    }
    // const goon = Field.fromBool(true)
    // for(const item of this.items) {
    //     addIf(goon, () => {
    //         goon.setBool(false)
    //         addIf(item, () => {
    //             item.print()
    //             goon.setBool(true)
    //         })
    //     })
    // }
  }
}

export class Environment {
  public code: string = "";

  protected usedIndexes: number = 0;
  protected currentIndex: number = 0;

  execute(code: string, comment?: string): void {
    this.code += code;
  }

  executeIf(field: Field, callback: () => unknown) {
    const falsy = new Field(this).setBool(false);
    field.execute("[");
    callback();
    falsy.execute("]");
  }
  executeWhile(field: Field, callback: () => unknown) {
    field.execute("[");
    callback();
    field.execute("]");
  }

  allocateIndex(): number {
    return this.usedIndexes++;
  }

  focusIndex(index: number): void {
    const diff = index - this.currentIndex;
    if (diff > 0) this.execute(">".repeat(diff), "goto " + index);
    else if (diff < 0) this.execute("<".repeat(-diff), "goto " + index);
    this.currentIndex = index;
  }
}
