export function createRange(total: number, interval = 0) {
	return Array.from({ length: Math.ceil(total / interval) }, (_, i) => i * interval);
}
