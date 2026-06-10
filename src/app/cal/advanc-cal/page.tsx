"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import HybridLoading from "@/app/loading";

// لودینگ ساده

// داینامیک ایمپورت
const AdvancedCalculatorContent = dynamic(
	() => import("@/components/AdvancedCalculatorContent"),
	{
		loading: () => <HybridLoading />,
		ssr: false,
	},
);

export default function AdvancedCalcPage() {
	return (
		<Suspense fallback={<HybridLoading />}>
			<AdvancedCalculatorContent />
		</Suspense>
	);
}
