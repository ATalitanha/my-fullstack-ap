import { ChangeLog, Unit } from "@/lib/type"

export function getChangeLogs(): ChangeLog[] {
    return [
        {
            version: "0.1.0",
            changes: ["ایجاد رابط کاربری ماشین حساب", "ساخت بخش تاریخچه"],
        },
        {
            version: "0.5.0",
            changes: ["ساخت و پیکربندی سایت", "استفاده از api برای تاریخچه"],
        },
        {
            version: "0.9.0",
            changes: ["راه اندازی برای تست", "تغییر رنگ بندی"],
        },
        {
            version: "1.0.0",
            changes: ["بهبود رابط کاربری", "رفع ایرادات گزارش داده شده", "راه اندازی عمومی"]
        },
        {
            version: "1.1.5",
            changes: ["تغییر رابط کاربری", "رفع اشکالات جزِِئی", ""]
        },
        {
            version: "1.6.0",
            changes: ["اضافه شدن بخش تغییرات", "رفع اشکالات جزِِئی"]
        },
        {
            version: "1.7.0",
            changes: ["تغییر رابط کاربری", "رفع ایرادات کلی"]
        },
        {
            version: "1.8.0",
            changes: ["اضافه شدن پرانتز", "تغییر نمایش خطا ها", "بهبود رابط کاربری"]
        },
        {
            version: "2.0.0",
            changes: ["اضافه شدن بخش messenger", "رفع ایرادات جزئی", "بهبود رابط کاربری", "بهینه سازی برای گوشی", "افزایش سرعت"]
        },
        {
            version: "2.1.0",
            changes: ["اضافه شدن قابلیت کار با دکمه کیبورد در ماشین حساب"]
        },
        {
            version: "3.0.0",
            changes: ["اضافه شدن حساب کاربری", "اضافه شدن بخش یادداشت", "بهبود رابط کاربری", "رفع ایرادات جزئی"]
        },
        {
            version: "3.1.0",
            changes: ["بهینه سازی برای زبان فارسی", "بهبود رابط کاربری", "رفع ایرادات جزئی"]
        },
        {
            version: "3.2.0",
            changes: ["افزایش امنیت", "بهبود رابط کاربری", "رفع ایرادات جزئی"]
        },
        {
            version: "3.3.0",
            changes: ["اضافه شدن لیست انجام وضایف", "بهبود رابط کاربری", "رفع ایرادات جزئی"]
        },
        {
            version: "3.4.0",
            changes: ["اضافه شدن تبدیل واحد", "بهبود رابط کاربری", "رفع ایرادات جزئی"]
        },
        {
            version: "3.9.0",
            changes: ["اضافه شدن ماشین حساب حرفه ای نسخه آزمایشی", "بهبود رابط کاربری", "رفع ایرادات جزئی"]
        },
        {
            version: "4.0.0",
            changes: ["اضافه شدن نمایش قیمت ارز و طلا", "بهبود رابط کاربری", "رفع ایرادات جزئی"]
        },
        {
            version: "4.2.0",
            changes: ["تغییر صفحه اصلی", "بهبود رابط کاربری", "رفع ایرادات جزئی"]
        },
        {
            version: "5.0.0",
            changes: ["طراحی مدرن و جدید","بازسازی رابط کاربری","بهینه سازی برای موبایل", "بهبود رابط کاربری", "رفع ایرادات جزئی","راه اندازی اولیه قابلیت های جدید"]
        },
    ];
};



export const UNITS: Unit[] = [
    // طول
    {
        category: "length",
        label: "متر",
        value: "m",
        factor: 1
    },
    {
        category: "length",
        label: "سانتی‌متر",
        value: "cm",
        factor: 0.01
    },
    {
        category: "length",
        label: "کیلومتر",
        value: "km",
        factor: 1000

    },
    {
        category: "length",
        label: "میلی‌متر",
        value: "mm",
        factor: 0.001

    },
    {
        category: "length",
        label: "اینچ",
        value: "in",
        factor: 0.0254

    },
    {
        category: "length",
        label: "فوت",
        value: "ft",
        factor: 0.3048

    },
    {
        category: "length",
        label: "یارد",
        value: "yd",
        factor: 0.9144

    },
    {
        category: "length",
        label: "مایل",
        value: "mile",
        factor: 1609.34

    },

    // وزن
    {
        category: "weight",
        label: "کیلوگرم",
        value: "kg",
        factor: 1

    },
    {
        category: "weight",
        label: "گرم",
        value: "g",
        factor: 0.001

    },
    {
        category: "weight",
        label: "تن",
        value: "t",
        factor: 1000

    },
    {
        category: "weight",
        label: "پوند",
        value: "lb",
        factor: 0.453592

    },
    {
        category: "weight",
        label: "اونس",
        value: "oz",
        factor: 0.0283495

    },

    // حجم
    {
        category: "volume",
        label: "لیتر",
        value: "l",
        factor: 1

    },
    {
        category: "volume",
        label: "میلی‌لیتر",
        value: "ml",
        factor: 0.001

    },
    {
        category: "volume",
        label: "متر مکعب",
        value: "m3",
        factor: 1000

    },
    {
        category: "volume",
        label: "گالن (US)",
        value: "gal",
        factor: 3.78541

    },
    {
        category: "volume",
        label: "پیمانه",
        value: "cup",
        factor: 0.24

    },

    // دما
    {
        category: "temperature",
        label: "سانتی‌گراد",
        value: "c"

    },
    {
        category: "temperature",
        label: "فارنهایت",
        value: "f"

    },
    {
        category: "temperature",
        label: "کلوین",
        value: "k"

    },

    // زمان
    {
        category: "time",
        label: "ثانیه",
        value: "s",
        factor: 1

    },
    {
        category: "time",
        label: "دقیقه",
        value: "min",
        factor: 60

    },
    {
        category: "time",
        label: "ساعت",
        value: "h",
        factor: 3600

    },
    {
        category: "time",
        label: "روز",
        value: "day",
        factor: 86400

    },
    {
        category: "time",
        label: "هفته",
        value: "week",
        factor: 604800

    },
    {
        category: "time",
        label: "سال",
        value: "year",
        factor: 31536000

    },

    // سرعت
    {
        category: "speed",
        label: "متر بر ثانیه",
        value: "m/s",
        factor: 1

    },
    {
        category: "speed",
        label: "کیلومتر بر ساعت",
        value: "km/h",
        factor: 0.277778

    },
    {
        category: "speed",
        label: "مایل بر ساعت",
        value: "mph",
        factor: 0.44704

    },
    {
        category: "speed",
        label: "گره",
        value: "knot",
        factor: 0.514444

    },

    // انرژی
    {
        category: "energy",
        label: "ژول",
        value: "J",
        factor: 1

    },

    {
        category: "energy",
        label: "کالری",
        value: "cal",
        factor: 4.184

    },
    {
        category: "energy",
        label: "کیلوکالری",
        value: "kcal",
        factor: 4184

    },
    {
        category: "energy",
        label: "کیلووات ساعت",
        value: "kWh",
        factor: 3.6e6

    },

    // فشار
    {
        category: "pressure",
        label: "پاسکال",
        value: "Pa",
        factor: 1

    },
    {
        category: "pressure",
        label: "بار",
        value: "bar",
        factor: 1e5

    },
    {
        category: "pressure",
        label: "اتمسفر",
        value: "atm",
        factor: 101325

    },
    {
        category: "pressure",
        label: "میلی‌متر جیوه",
        value: "mmHg",
        factor: 133.322

    },
    {
        category: "pressure",
        label: "psi",
        value: "psi",
        factor: 6894.76

    },

    // مساحت
    {
        category: "area",
        label: "متر مربع",
        value: "m2",
        factor: 1

    },
    {
        category: "area",
        label: "کیلومتر مربع",
        value: "km2",
        factor: 1e6

    },
    {
        category: "area",
        label: "هکتار",
        value: "ha",
        factor: 10000

    },
    {
        category: "area",
        label: "اینچ مربع",
        value: "in2",
        factor: 0.00064516

    },
    {
        category: "area",
        label: "فوت مربع",
        value: "ft2",
        factor: 0.092903

    },
    {
        category: "area",
        label: "یارد مربع",
        value: "yd2",
        factor: 0.836127

    },

    // روشنایی
    {
        category: "light",
        label: "لوکس",
        value: "lux",
        factor: 1

    },
    {
        category: "light",
        label: "فوت‌کاندلا",
        value: "fc",
        factor: 10.764

    },
    // داده و حافظه
    { 
        category: "data", 
        label: "بیت", 
        value: "bit", 
        factor: 1 / 8 },
    { 
        category: "data", 
        label: "بایت", 
        value: "B", 
        factor: 1 },
    { 
        category: "data", 
        label: "کیلوبایت", 
        value: "KB", 
        factor: 1024 },
    { 
        category: "data", 
        label: "مگابایت", 
        value: "MB", 
        factor: 1024 ** 2 },
    { 
        category: "data", 
        label: "گیگابایت", 
        value: "GB", 
        factor: 1024 ** 3 },
    { 
        category: "data", 
        label: "ترابایت", 
        value: "TB", 
        factor: 1024 ** 4 },

    // توان
    { 
        category: "power", 
        label: "وات", 
        value: "W", 
        factor: 1 },
    { 
        category: "power", 
        label: "کیلووات", 
        value: "kW", 
        factor: 1000 },
    { 
        category: "power", 
        label: "اسب بخار", 
        value: "hp", 
        factor: 745.7 },

    // زاویه
    { 
        category: "angle", 
        label: "درجه", 
        value: "deg", 
        factor: 1 },
    { 
        category: "angle", 
        label: "رادیان", 
        value: "rad", 
        factor: 57.2958 },
    { 
        category: "angle", 
        label: "گراد", 
        value: "grad", 
        factor: 0.9 },

    // فرکانس
    { 
        category: "frequency", 
        label: "هرتز", 
        value: "Hz", 
        factor: 1 },
    { 
        category: "frequency", 
        label: "کیلوهرتز", 
        value: "kHz", 
        factor: 1000 },
    { 
        category: "frequency", 
        label: "مگاهرتز", 
        value: "MHz", 
        factor: 1e6 },
    { 
        category: "frequency", 
        label: "گیگاهرتز", 
        value: "GHz", 
        factor: 1e9 },

    // مصرف سوخت
    { 
        category: "fuel", 
        label: "لیتر در 100 کیلومتر", 
        value: "l/100km", 
        factor: 1 },
    { 
        category: "fuel", 
        label: "کیلومتر بر لیتر", 
        value: "km/l", 
        factor: 100 / 1 },
    { 
        category: "fuel", 
        label: "مایل بر گالن (US)", 
        value: "mpg", 
        factor: 235.215 },
];
