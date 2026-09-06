export function createRange(total: number, interval = 0) {
	return Array.from({ length: Math.ceil(total / interval) }, (_, i) => i * interval);
}

export async function mapSeries<T, R>(
	items: T[],
	mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
	const results: R[] = [];
	for (const [index, item] of items.entries()) {
		results.push(await mapper(item, index));
	}
	return results;
}
