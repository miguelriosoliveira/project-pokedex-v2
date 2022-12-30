export const TOTAL_ITEMS_HEADER = 'x-total-items';

export const GENERATIONS = {
	GEN1: 'generation-i',
	GEN2: 'generation-ii',
	GEN3: 'generation-iii',
	GEN4: 'generation-iv',
	GEN5: 'generation-v',
	GEN6: 'generation-vi',
	GEN7: 'generation-vii',
	GEN8: 'generation-viii',
	GEN9: 'generation-ix',
};

export const GENERATION_NAMES = {
	[GENERATIONS.GEN1]: { roman: 'Generation I', arabic: 'Generation 1' },
	[GENERATIONS.GEN2]: { roman: 'Generation II', arabic: 'Generation 2' },
	[GENERATIONS.GEN3]: { roman: 'Generation III', arabic: 'Generation 3' },
	[GENERATIONS.GEN4]: { roman: 'Generation IV', arabic: 'Generation 4' },
	[GENERATIONS.GEN5]: { roman: 'Generation V', arabic: 'Generation 5' },
	[GENERATIONS.GEN6]: { roman: 'Generation VI', arabic: 'Generation 6' },
	[GENERATIONS.GEN7]: { roman: 'Generation VII', arabic: 'Generation 7' },
	[GENERATIONS.GEN8]: { roman: 'Generation VIII', arabic: 'Generation 8' },
	[GENERATIONS.GEN9]: { roman: 'Generation IX', arabic: 'Generation 9' },
};

export const STARTERS_BY_GENERATION = {
	[GENERATIONS.GEN1]: [1, 4, 7],
	[GENERATIONS.GEN2]: [152, 155, 158],
	[GENERATIONS.GEN3]: [252, 255, 258],
	[GENERATIONS.GEN4]: [387, 390, 393],
	[GENERATIONS.GEN5]: [495, 498, 501],
	[GENERATIONS.GEN6]: [650, 653, 656],
	[GENERATIONS.GEN7]: [722, 725, 728],
	[GENERATIONS.GEN8]: [810, 813, 816],
	[GENERATIONS.GEN9]: [906, 909, 912],
};

export const DEFAULT_PAGE_SIZE = 20;
