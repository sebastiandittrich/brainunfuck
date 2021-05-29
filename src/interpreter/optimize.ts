import { Statements } from "./ast";

export const optimize = (parts: Statements) => {
  let index = 0;
  while (index < parts.length) {
    const previousPart = parts[index - 1];
    const part = parts[index];
    if (part.type == "loop") {
      if (
        part.value.length == 1 &&
        part.value[0].type == "change_value" &&
        part.value[0].value == -1
      ) {
        // [-]
        parts[index] = { type: "zero_loop" };
      } else optimize(part.value);
      index++;
    } else if (
      part.type == "change_value" &&
      previousPart?.type == "change_value"
    ) {
      parts.splice(index - 1, 2, {
        type: "change_value",
        value: previousPart.value + part.value,
      });
    } else if (
      part.type == "change_pointer" &&
      previousPart?.type == "change_pointer"
    ) {
      parts.splice(index - 1, 2, {
        type: "change_pointer",
        value: previousPart.value + part.value,
      });
    } else {
      index++;
    }
  }
  return parts;
};
