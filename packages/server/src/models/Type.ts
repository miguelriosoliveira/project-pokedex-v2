import mongoose from 'mongoose';

export interface TypeSchema {
	name: string;

	doubleDamageFrom: string[];
	doubleDamageTo: string[];

	halfDamageFrom: string[];
	halfDamageTo: string[];

	noDamageFrom: string[];
	noDamageTo: string[];
}

export const Type = mongoose.model(
	'Type',
	new mongoose.Schema<TypeSchema>({
		name: String,

		doubleDamageFrom: [String],
		doubleDamageTo: [String],

		halfDamageFrom: [String],
		halfDamageTo: [String],

		noDamageFrom: [String],
		noDamageTo: [String],
	}),
);
