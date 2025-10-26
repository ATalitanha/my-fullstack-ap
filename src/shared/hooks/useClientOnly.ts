/**
 * Reason: A hook to ensure a component only renders on the client-side.
 * This is useful for components that rely on browser-specific APIs,
 * preventing server-side rendering mismatches.
 */
import { useState, useEffect } from "react";

export function useClientOnly() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return isClient;
}
