import mongoose from 'mongoose';

export interface TypeSchema {
	name: string;

	double_damage_from: string[];
	double_damage_to: string[];

	half_damage_from: string[];
	half_damage_to: string[];

	no_damage_from: string[];
	no_damage_to: string[];
}

export const Type = mongoose.model(
	'Type',
	new mongoose.Schema<TypeSchema>({
		name: String,

		double_damage_from: [String],
		double_damage_to: [String],

		half_damage_from: [String],
		half_damage_to: [String],

		no_damage_from: [String],
		no_damage_to: [String],
	}),
);
