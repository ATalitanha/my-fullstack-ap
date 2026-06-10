"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import HybridLoading from "@/app/loading";

// اسکلتون لودینگ

// داینامیک ایمپورت محتوای اصلی
const UnitConverterContent = dynamic(
	() => import("@/components/UnitsConverterContent"),
	{
		loading: () => <HybridLoading />,
		ssr: false,
	},
);

export default function UnitConverterPage() {
	return (
		<Suspense fallback={<HybridLoading />}>
			<UnitConverterContent />
		</Suspense>
	);
}
