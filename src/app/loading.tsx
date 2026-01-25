'use client';

import { useEffect, useRef } from "react";



export default function HybridLoading() {
    const heroRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null)


    useEffect(() => {
        let ctx: any;
        const run = async () => {
          const { gsap } = await import("gsap");
          if (!heroRef.current) return;
          ctx = gsap.context(() => {
            gsap.from(heroRef.current!, {
              opacity: 0,
              y: 20,
              duration: 0.8,
              ease: "power2.out",
            });
            if (titleRef.current) {
              gsap.from(titleRef.current!, {
                opacity: 0,
                y: 10,
                duration: 0.8,
                delay: 0.2,
                ease: "power2.out",
              },);
            }
          },);
        };
        run();
        return () => ctx?.revert?.();
      }, []);
    

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 animate-pulse">
                    در حال بارگذاری...
                </p>
            </div>
        </div>

    );
}