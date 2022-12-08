export const TOTAL_ITEMS_HEADER = 'x-total-items';

export const GENERATIONS = {
	g1: 'generation-i',
	g2: 'generation-ii',
	g3: 'generation-iii',
	g4: 'generation-iv',
	g5: 'generation-v',
	g6: 'generation-vi',
	g7: 'generation-vii',
	g8: 'generation-viii',
	g9: 'generation-ix',
};

export const GENERATION_NAMES = {
	[GENERATIONS.g1]: { roman: 'Generation I', arabic: 'Generation 1' },
	[GENERATIONS.g2]: { roman: 'Generation II', arabic: 'Generation 2' },
	[GENERATIONS.g3]: { roman: 'Generation III', arabic: 'Generation 3' },
	[GENERATIONS.g4]: { roman: 'Generation IV', arabic: 'Generation 4' },
	[GENERATIONS.g5]: { roman: 'Generation V', arabic: 'Generation 5' },
	[GENERATIONS.g6]: { roman: 'Generation VI', arabic: 'Generation 6' },
	[GENERATIONS.g7]: { roman: 'Generation VII', arabic: 'Generation 7' },
	[GENERATIONS.g8]: { roman: 'Generation VIII', arabic: 'Generation 8' },
	[GENERATIONS.g9]: { roman: 'Generation IX', arabic: 'Generation 9' },
};

export const STARTERS_BY_GENERATION = {
	[GENERATIONS.g1]: [1, 4, 7],
	[GENERATIONS.g2]: [152, 155, 158],
	[GENERATIONS.g3]: [252, 255, 258],
	[GENERATIONS.g4]: [387, 390, 393],
	[GENERATIONS.g5]: [495, 498, 501],
	[GENERATIONS.g6]: [650, 653, 656],
	[GENERATIONS.g7]: [722, 725, 728],
	[GENERATIONS.g8]: [810, 813, 816],
	[GENERATIONS.g9]: [906, 909, 912],
};

export const DEFAULT_PAGE_SIZE = 20;
