import { useEffect, useState } from "react";

const TICK_MS = 1000;

// The milliseconds left until an instant, every second, 0 once it has come
export const useCountdown = (target: Date | null): number | null => {
	const [now, setNow] = useState(() => Date.now());
	const targetTime = target?.getTime() ?? null;

	useEffect(() => {
		if (targetTime === null) return;

		const interval = setInterval(() => setNow(Date.now()), TICK_MS);

		return () => clearInterval(interval);
	}, [targetTime]);

	return targetTime === null ? null : Math.max(0, targetTime - now);
};
