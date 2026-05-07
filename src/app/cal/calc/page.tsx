"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import HybridLoading from "@/app/loading";

// لودینگ اسکلتون ساده

// داینامیک ایمپورت کامپوننت اصلی
const CalculatorContent = dynamic(
  () => import("@/components/CalculatorContent"),
  {
    loading: () => <HybridLoading />,
    ssr: false, // غیرفعال کردن SSR برای کاهش حجم
  },
);

export default function CalculatorPage() {
  return (
    <Suspense fallback={<HybridLoading />}>
      <CalculatorContent />
    </Suspense>
  );
}
