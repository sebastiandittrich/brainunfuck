export type ChangeValue = {
  type: "change_value";
  value: number;
};
export type ChangePointer = {
  type: "change_pointer";
  value: number;
};
export type Print = {
  type: "print";
};
export type Read = {
  type: "read";
};
export type Loop = {
  type: "loop";
  value: Statements;
};
export type ZeroLoop = {
  type: "zero_loop";
};

export type Statement =
  | ChangeValue
  | ChangePointer
  | Print
  | Read
  | Loop
  | ZeroLoop;
export type Statements = Statement[];
