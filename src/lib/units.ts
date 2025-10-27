import { Unit } from "@/lib/type";

export const UNITS: Unit[] = [
	// length
	{
		category: "length",
		label: "متر",
		value: "m",
		factor: 1,
	},
	{
		category: "length",
		label: "سانتی‌متر",
		value: "cm",
		factor: 0.01,
	},
	{
		category: "length",
		label: "کیلومتر",
		value: "km",
		factor: 1000,
	},
	{
		category: "length",
		label: "میلی‌متر",
		value: "mm",
		factor: 0.001,
	},
	{
		category: "length",
		label: "اینچ",
		value: "in",
		factor: 0.0254,
	},
	{
		category: "length",
		label: "فوت",
		value: "ft",
		factor: 0.3048,
	},
	{
		category: "length",
		label: "یارد",
		value: "yd",
		factor: 0.9144,
	},
	{
		category: "length",
		label: "مایل",
		value: "mile",
		factor: 1609.34,
	},

	// weight
	{
		category: "weight",
		label: "کیلوگرم",
		value: "kg",
		factor: 1,
	},
	{
		category: "weight",
		label: "گرم",
		value: "g",
		factor: 0.001,
	},
	{
		category: "weight",
		label: "تن",
		value: "t",
		factor: 1000,
	},
	{
		category: "weight",
		label: "پوند",
		value: "lb",
		factor: 0.453592,
	},
	{
		category: "weight",
		label: "اونس",
		value: "oz",
		factor: 0.0283495,
	},

	// volume
	{
		category: "volume",
		label: "لیتر",
		value: "l",
		factor: 1,
	},
	{
		category: "volume",
		label: "میلی‌لیتر",
		value: "ml",
		factor: 0.001,
	},
	{
		category: "volume",
		label: "متر مکعب",
		value: "m3",
		factor: 1000,
	},
	{
		category: "volume",
		label: "گالن (US)",
		value: "gal",
		factor: 3.78541,
	},
	{
		category: "volume",
		label: "پیمانه",
		value: "cup",
		factor: 0.24,
	},

	// temperature
	{
		category: "temperature",
		label: "سانتی‌گراد",
		value: "c",
	},
	{
		category: "temperature",
		label: "فارنهایت",
		value: "f",
	},
	{
		category: "temperature",
		label: "کلوین",
		value: "k",
	},

	// time
	{
		category: "time",
		label: "ثانیه",
		value: "s",
		factor: 1,
	},
	{
		category: "time",
		label: "دقیقه",
		value: "min",
		factor: 60,
	},
	{
		category: "time",
		label: "ساعت",
		value: "h",
		factor: 3600,
	},
	{
		category: "time",
		label: "روز",
		value: "day",
		factor: 86400,
	},
	{
		category: "time",
		label: "هفته",
		value: "week",
		factor: 604800,
	},
	{
		category: "time",
		label: "سال",
		value: "year",
		factor: 31536000,
	},

	// speed
	{
		category: "speed",
		label: "متر بر ثانیه",
		value: "m/s",
		factor: 1,
	},
	{
		category: "speed",
		label: "کیلومتر بر ساعت",
		value: "km/h",
		factor: 0.277778,
	},
	{
		category: "speed",
		label: "مایل بر ساعت",
		value: "mph",
		factor: 0.44704,
	},
	{
		category: "speed",
		label: "گره",
		value: "knot",
		factor: 0.514444,
	},

	// energy
	{
		category: "energy",
		label: "ژول",
		value: "J",
		factor: 1,
	},

	{
		category: "energy",
		label: "کالری",
		value: "cal",
		factor: 4.184,
	},
	{
		category: "energy",
		label: "کیلوکالری",
		value: "kcal",
		factor: 4184,
	},
	{
		category: "energy",
		label: "کیلووات ساعت",
		value: "kWh",
		factor: 3.6e6,
	},

	// pressure
	{
		category: "pressure",
		label: "پاسکال",
		value: "Pa",
		factor: 1,
	},
	{
		category: "pressure",
		label: "بار",
		value: "bar",
		factor: 1e5,
	},
	{
		category: "pressure",
		label: "اتمسفر",
		value: "atm",
		factor: 101325,
	},
	{
		category: "pressure",
		label: "میلی‌متر جیوه",
		value: "mmHg",
		factor: 133.322,
	},
	{
		category: "pressure",
		label: "psi",
		value: "psi",
		factor: 6894.76,
	},

	// area
	{
		category: "area",
		label: "متر مربع",
		value: "m2",
		factor: 1,
	},
	{
		category: "area",
		label: "کیلومتر مربع",
		value: "km2",
		factor: 1e6,
	},
	{
		category: "area",
		label: "هکتار",
		value: "ha",
		factor: 10000,
	},
	{
		category: "area",
		label: "اینچ مربع",
		value: "in2",
		factor: 0.00064516,
	},
	{
		category: "area",
		label: "فوت مربع",
		value: "ft2",
		factor: 0.092903,
	},
	{
		category: "area",
		label: "یارد مربع",
		value: "yd2",
		factor: 0.836127,
	},

	// light
	{
		category: "light",
		label: "لوکس",
		value: "lux",
		factor: 1,
	},
	{
		category: "light",
		label: "فوت‌کاندلا",
		value: "fc",
		factor: 10.764,
	},
	// data
	{
		category: "data",
		label: "بیت",
		value: "bit",
		factor: 1 / 8,
	},
	{
		category: "data",
		label: "بایت",
		value: "B",
		factor: 1,
	},
	{
		category: "data",
		label: "کیلوبایت",
		value: "KB",
		factor: 1024,
	},
	{
		category: "data",
		label: "مگابایت",
		value: "MB",
		factor: 1024 ** 2,
	},
	{
		category: "data",
		label: "گیگابایت",
		value: "GB",
		factor: 1024 ** 3,
	},
	{
		category: "data",
		label: "ترابایت",
		value: "TB",
		factor: 1024 ** 4,
	},

	// power
	{
		category: "power",
		label: "وات",
		value: "W",
		factor: 1,
	},
	{
		category: "power",
		label: "کیلووات",
		value: "kW",
		factor: 1000,
	},
	{
		category: "power",
		label: "اسب بخار",
		value: "hp",
		factor: 745.7,
	},

	// angle
	{
		category: "angle",
		label: "درجه",
		value: "deg",
		factor: 1,
	},
	{
		category: "angle",
		label: "رادیان",
		value: "rad",
		factor: 57.2958,
	},
	{
		category: "angle",
		label: "گراد",
		value: "grad",
		factor: 0.9,
	},

	// frequency
	{
		category: "frequency",
		label: "هرتز",
		value: "Hz",
		factor: 1,
	},
	{
		category: "frequency",
		label: "کیلوهرتز",
		value: "kHz",
		factor: 1000,
	},
	{
		category: "frequency",
		label: "مگاهرتز",
		value: "MHz",
		factor: 1e6,
	},
	{
		category: "frequency",
		label: "گیگاهرتز",
		value: "GHz",
		factor: 1e9,
	},

	// fuel
	{
		category: "fuel",
		label: "لیتر در 100 کیلومتر",
		value: "l/100km",
		factor: 1,
	},
	{
		category: "fuel",
		label: "کیلومتر بر لیتر",
		value: "km/l",
		factor: 100 / 1,
	},
	{
		category: "fuel",
		label: "مایل بر گالن (US)",
		value: "mpg",
		factor: 235.215,
	},
];
