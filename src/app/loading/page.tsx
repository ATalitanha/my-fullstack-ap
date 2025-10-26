// نسخه بهبود یافته
export default function Loading() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 mb-4"></div>
			<p className="text-gray-600 dark:text-gray-300 animate-pulse">
				در حال بارگذاری...
			</p>
		</div>
	);
}
