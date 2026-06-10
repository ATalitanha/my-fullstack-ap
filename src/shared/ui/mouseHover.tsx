"use client";

import { useEffect, useState } from "react";

export default function MouseHover() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return (
		<div
			className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
			style={{
				background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15) 0%, transparent 80%)`,
			}}
		/>
	);
}
