export type Operation = "*" | "+" | "-" | "/" | "√" | "^"| "("| ")";
export type OperatorBtn = Operation | "CA" | "C" | "DEL" | "=" | "+/-" | "." | string;

export const OPERATIONS: Operation[] = ["*", "+", "-", "/", "√", "^", "(", ")"];
export const BUTTONS: OperatorBtn[] = [
  "CA", "C", "DEL", "/", "7", "8", "9", "*",
  "4", "5", "6", "-", "1", "2", "3", "+",
  "+/-", "0", ".", "=", "^", "√", "(", ")"
];
