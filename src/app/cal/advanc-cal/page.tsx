"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const AdvancedCalculator = dynamic(
	() => import("./advanced-calculator"),
	{
		loading: () => <div>Loading...</div>,
	},
);

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AdvancedCalculator />
		</Suspense>
	);
}
