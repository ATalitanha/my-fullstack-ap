"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import HybridLoading from "../loading";

// اسکلتون لودینگ

// داینامیک ایمپورت محتوای اصلی
const PricesTableContent = dynamic(
	() => import("@/components/PricesTableContent"),
	{
		loading: () => <HybridLoading />,
		ssr: false,
	},
);

export default function PricesTablePage() {
	return (
		<Suspense fallback={<HybridLoading />}>
			<PricesTableContent />
		</Suspense>
	);
}
