const generations = {
	g1: 'generation-i',
	g2: 'generation-ii',
	g3: 'generation-iii',
	g4: 'generation-iv',
	g5: 'generation-v',
	g6: 'generation-vi',
	g7: 'generation-vii',
};

module.exports = {
	generations,

	totalItemsHeader: 'x-total-items',

	generationNames: {
		[generations.g1]: { roman: 'Generation I', arabic: 'Generation 1' },
		[generations.g2]: { roman: 'Generation II', arabic: 'Generation 2' },
		[generations.g3]: { roman: 'Generation III', arabic: 'Generation 3' },
		[generations.g4]: { roman: 'Generation IV', arabic: 'Generation 4' },
		[generations.g5]: { roman: 'Generation V', arabic: 'Generation 5' },
		[generations.g6]: { roman: 'Generation VI', arabic: 'Generation 6' },
		[generations.g7]: { roman: 'Generation VII', arabic: 'Generation 7' },
	},

	startersByGeneration: {
		[generations.g1]: [1, 4, 7],
		[generations.g2]: [152, 155, 158],
		[generations.g3]: [252, 255, 258],
		[generations.g4]: [387, 390, 393],
		[generations.g5]: [495, 498, 501],
		[generations.g6]: [650, 653, 656],
		[generations.g7]: [722, 725, 728],
	},

	getIdFromUrl(url) {
		return url.split('/').slice(-2, -1).pop();
	},
};
