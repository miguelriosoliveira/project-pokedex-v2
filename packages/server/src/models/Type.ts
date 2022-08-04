import { model, Schema } from 'mongoose';

export const Type = model(
	'Type',
	new Schema({
		name: String,

		doubleDamageFrom: [String],
		doubleDamageTo: [String],

		halfDamageFrom: [String],
		halfDamageTo: [String],

		noDamageFrom: [String],
		noDamageTo: [String],
	}),
);
