import {ChangeLog, Unit} from "@/lib/type"

export function getChangeLogs(): ChangeLog[] {
    return [
        {
            version: "0.1.0",
            changes: ["ایجاد رابط کاربری ماشین حساب","ساخت بخش تاریخچه"],
        },
        {
            version: "0.5.0",
            changes: ["ساخت و پیکربندی سایت","استفاده از api برای تاریخچه"],
        },
        {
            version: "0.9.0",
            changes: ["راه اندازی برای تست","تغییر رنگ بندی"],
        },
        {
            version: "1.0.0",
            changes: ["بهبود رابط کاربری","رفع ایرادات گزارش داده شده","راه اندازی عمومی"]
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
        {
            version: "1.8.0",
            changes: ["اضافه شدن پرانتز","تغییر نمایش خطا ها","بهبود رابط کاربری"]
        },
        {
            version: "2.0.0",
            changes: ["اضافه شدن بخش messenger","رفع ایرادات جزئی","بهبود رابط کاربری","بهینه سازی برای گوشی","افزایش سرعت"]
        },
        {
            version: "2.1.0",
            changes: ["اضافه شدن قابلیت کار با دکمه کیبورد در ماشین حساب"]
        },
        {
            version: "3.0.0",
            changes: ["اضافه شدن حساب کاربری","اضافه شدن بخش یادداشت","بهبود رابط کاربری","رفع ایرادات جزئی"]
        },
        {
            version: "3.1.0",
            changes: ["بهینه سازی برای زبان فارسی","بهبود رابط کاربری","رفع ایرادات جزئی"]
        },
        {
            version: "3.2.0",
            changes: ["افزایش امنیت","بهبود رابط کاربری","رفع ایرادات جزئی"]
        },
        {
            version: "3.2.0",
            changes: ["اضافه شدن لیست انجام وضایف","بهبود رابط کاربری","رفع ایرادات جزئی"]
        },
    ];
};

export const UNITS: Unit[] = [
  { category: "length", label: "متر", value: "m", factor: 1 },
  { category: "length", label: "سانتی‌متر", value: "cm", factor: 0.01 },
  { category: "length", label: "کیلومتر", value: "km", factor: 1000 },
  { category: "length", label: "میلی‌متر", value: "mm", factor: 0.001 },
  { category: "weight", label: "کیلوگرم", value: "kg", factor: 1 },
  { category: "weight", label: "گرم", value: "g", factor: 0.001 },
  { category: "weight", label: "تن", value: "t", factor: 1000 },
  { category: "volume", label: "لیتر", value: "l", factor: 1 },
  { category: "volume", label: "میلی‌لیتر", value: "ml", factor: 0.001 },
  { category: "volume", label: "متر مکعب", value: "m3", factor: 1000 },
  { category: "temperature", label: "سانتی‌گراد", value: "c" },
  { category: "temperature", label: "فارنهایت", value: "f" },
  { category: "temperature", label: "کلوین", value: "k" },
  { category: "time", label: "ثانیه", value: "s", factor: 1 },
  { category: "time", label: "دقیقه", value: "min", factor: 60 },
  { category: "time", label: "ساعت", value: "h", factor: 3600 },
];