export function calcResult(input: string): string {
  try {
    // جلوگیری از اجراهای خطرناک
    const sanitized = input.replace(/[^-()\d/*+.√^]/g, "");

    // پشتیبانی از جذر
    const final = sanitized.replace(/√(\d+)/g, (_, num) => `Math.sqrt(${num})`);

    // توان
    const powerReplaced = final.replace(/(\d+)\^(\d+)/g, (_, base, exp) => `Math.pow(${base}, ${exp})`);

    const output = Function(`return (${powerReplaced})`)();
    return Number.isFinite(output) ? output.toString() : "خطا";
  } catch {
    return "خطا در محاسبه";
  }
}
