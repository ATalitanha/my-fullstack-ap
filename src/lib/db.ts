import {ChangeLog} from "@/lib/type"

export function getChangeLogs(): ChangeLog[] {
    return [
        {
            version: "0.1.0",
            changes: ["ایجاد رابط کاربری ماشین حساب","ساخت بخش تاریخچه استاتیک"],
        },
        {
            version: "0.5.0",
            changes: ["ساخت api برای تاریخچه","ساخت و پیکربندی دیتابیس","استفاده از api برای تاریخچه"],
        },
        {
            version: "0.9.0",
            changes: ["ایجاد پروژه در vercel","پیکربندی prisma در supabase","اتصال vercel به supabase"],
        },
        {
            version: "1.0.0",
            changes: ["بهبود رابط کاربری","بارگزاری در سرور و ایجاد دامنه عمومی"]
        },
        {
            version: "1.1.5",
            changes: ["تغییر رابط کاربری","رفع اشکالات جزِِئی",""]
        },
        {
            version: "1.6.0",
            changes: ["اضافه شدن بخش تغییرات","رفع اشکالات جزِِئی"]
        },
        {
            version: "1.7.0",
            changes: ["تغییر رابط کاربری","رفع ایرادات کلی"]
        },
    ];
};