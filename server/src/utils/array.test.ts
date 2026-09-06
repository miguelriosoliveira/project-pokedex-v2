import { createRange, mapSeries } from './array';

describe('createRange', () => {
	it('returns offsets for each page', () => {
		expect(createRange(50, 20)).toEqual([0, 20, 40]);
	});
});

describe('mapSeries', () => {
	it('runs mappers one after another and keeps order', async () => {
		const started: number[] = [];

		const result = await mapSeries([1, 2, 3], async (item, index) => {
			started.push(item);
			await Promise.resolve();
			return `${index}:${item}`;
		});

		expect(started).toEqual([1, 2, 3]);
		expect(result).toEqual(['0:1', '1:2', '2:3']);
	});
});
