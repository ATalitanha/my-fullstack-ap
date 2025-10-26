/**
 * Calculates the result of a mathematical expression.
 * It sanitizes the input, handles square roots and powers, and then evaluates the expression.
 * @param {string} input - The mathematical expression to calculate.
 * @returns {string} The result of the calculation or an error message.
 */
export function calcResult(input: string): string {
	try {
		// جلوگیری از اجراهای خطرناک
		const sanitized = input.replace(/[^-()\d/*+.√^]/g, "").replace(/\(\)/g, "");

		// پشتیبانی از جذر
		const sqrtReplaced = sanitized.replace(
			/√(\d+)/g,
			(_, num) => `Math.sqrt(${num})`,
		);

		// توان
		const powerReplaced = sqrtReplaced.replace(/\^/g, "**");

		const output = Function(`return (${powerReplaced})`)();
		return Number.isFinite(output) ? output.toString() : "خطا";
	} catch {
		return "خطا در محاسبه";
	}
}
