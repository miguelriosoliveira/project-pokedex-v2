import { splitEvolutionBranches } from './evolution';

describe('splitEvolutionBranches', () => {
	it('keeps a linear chain in common', () => {
		expect(splitEvolutionBranches([['charmander', 'charmeleon', 'charizard']])).toEqual({
			common: ['charmander', 'charmeleon', 'charizard'],
			variants: [],
		});
	});

	it('puts the shared species in common and each branch in variants', () => {
		expect(
			splitEvolutionBranches([
				['charcadet', 'armarouge'],
				['charcadet', 'ceruledge'],
			]),
		).toEqual({
			common: ['charcadet'],
			variants: ['armarouge', 'ceruledge'],
		});
	});
});
