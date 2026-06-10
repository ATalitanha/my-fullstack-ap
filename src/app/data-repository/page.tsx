"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import HybridLoading from "../loading";

// داینامیک ایمپورت محتوای اصلی
const DataRepositoryContent = dynamic(
	() => import("@/components/DataRepositoryContent"),
	{
		loading: () => <HybridLoading />,
		ssr: false,
	},
);

export default function DataRepositoryPage() {
	return (
		<Suspense fallback={<HybridLoading />}>
			<DataRepositoryContent />
		</Suspense>
	);
}
