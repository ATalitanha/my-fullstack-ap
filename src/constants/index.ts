/**
 * Represents the types of mathematical operations.
 */
export type Operation = "*" | "+" | "-" | "/" | "√" | "^" | "(" | ")";

/**
 * Represents the types of calculator buttons.
 */
export type OperatorBtn =
	| Operation
	| "CA"
	| "C"
	| "DEL"
	| "="
	| "+/-"
	| "."
	| string;

/**
 * An array of mathematical operations.
 * @type {Operation[]}
 */
export const OPERATIONS: Operation[] = ["*", "+", "-", "/", "√", "^", "(", ")"];

/**
 * An array of calculator buttons.
 * @type {OperatorBtn[]}
 */
export const BUTTONS: OperatorBtn[] = [
	"CA",
	"C",
	"DEL",
	"/",
	"7",
	"8",
	"9",
	"*",
	"4",
	"5",
	"6",
	"-",
	"1",
	"2",
	"3",
	"+",
	"+/-",
	"0",
	".",
	"=",
	"^",
	"√",
	"(",
	")",
];
