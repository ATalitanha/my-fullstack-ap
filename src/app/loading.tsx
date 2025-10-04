// components/HybridLoading.jsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/ui/header';

export default function HybridLoading() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const pathname = usePathname();

    // صفحاتی که لودینگ اولیه نمی‌خواهند
    const noInitialLoadingPaths = ['/dashboard', '/profile'];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 800); // مدت زمان نمایش لودینگ

        return () => clearTimeout(timer);
    }, []);

    // اگر صفحه جزو صفحات بدون لودینگ است یا لودینگ تمام شده
    if (noInitialLoadingPaths.includes(pathname) || !isInitialLoading) {
        return null;
    }

    return (
        <>
            <Header />
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 animate-pulse">
                        در حال بارگذاری...
                    </p>
                </div>
            </div>
        </>
    );
}