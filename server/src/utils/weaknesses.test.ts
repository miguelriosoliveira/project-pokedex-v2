import { createType } from './tests/types';
import { getTypeMatchups, getWeaknesses } from './weaknesses';

describe('getTypeMatchups', () => {
	it('splits defensive and offensive matchups for a normal type', () => {
		const normal = createType({
			name: 'normal',
			double_damage_from: ['fighting'],
			half_damage_from: [],
			no_damage_from: ['ghost'],
			double_damage_to: [],
			half_damage_to: ['rock', 'steel'],
			no_damage_to: ['ghost'],
		});

		expect(getTypeMatchups([normal])).toEqual({
			double_damage_from: ['fighting'],
			half_damage_from: [],
			no_damage_from: ['ghost'],
			double_damage_to: [],
			half_damage_to: ['rock', 'steel'],
			no_damage_to: ['ghost'],
		});
	});
});

describe('getWeaknesses', () => {
	it('only lists types that deal super-effective damage', () => {
		const normal = createType({
			name: 'normal',
			double_damage_from: ['fighting'],
			half_damage_from: [],
			no_damage_from: ['ghost'],
			half_damage_to: ['rock', 'steel'],
			no_damage_to: ['ghost'],
		});

		expect(getWeaknesses([normal])).toEqual(['fighting']);
	});

	it('cancels a super-effective hit that the other type resists', () => {
		const grass = createType({
			name: 'grass',
			double_damage_from: ['bug', 'fire', 'flying', 'ice', 'poison'],
			half_damage_from: ['electric', 'grass', 'ground', 'water'],
			no_damage_from: [],
		});
		const poison = createType({
			name: 'poison',
			double_damage_from: ['ground', 'psychic'],
			half_damage_from: ['bug', 'fairy', 'fighting', 'grass', 'poison'],
			no_damage_from: [],
		});

		expect(getWeaknesses([grass, poison])).toEqual(['fire', 'flying', 'ice', 'psychic']);
	});
});
