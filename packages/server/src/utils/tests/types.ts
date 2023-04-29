import { TypeSchema } from '../../models';

export function createType(data: Partial<TypeSchema> = {}): TypeSchema {
	return {
		name: 'string',
		double_damage_from: ['string[]'],
		double_damage_to: ['string[]'],
		half_damage_from: ['string[]'],
		half_damage_to: ['string[]'],
		no_damage_from: ['string[]'],
		no_damage_to: ['string[]'],
		...data,
	};
}
