'use client';


import { usePathname } from 'next/navigation'

export default function HybridLoading() {
    const pathname = usePathname();

    // صفحاتی که لودینگ اولیه نمی‌خواهند
    const noInitialLoadingPaths = ['/todo', '/notes'];



    // اگر صفحه جزو صفحات بدون لودینگ است یا لودینگ تمام شده
    if (noInitialLoadingPaths.includes(pathname)) {
        return null;
    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 animate-pulse">
                    در حال بارگذاری...
                </p>
            </div>
        </div>

    );
}