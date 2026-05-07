/**
 * 📌 تابع عمومی برای هندل کردن خطاها در API
 * @param error - شیء خطا
 * @param context - توضیح زمینه خطا (برای لاگ و پاسخ)
 * @returns Response استاندارد با وضعیت 500
 */
export function errorResponse(error: unknown, context: string = "خطای سرور") {
  console.error(context, error);

  return new Response(JSON.stringify({ error: context }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}
