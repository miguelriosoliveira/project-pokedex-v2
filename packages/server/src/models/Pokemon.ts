import mongoose from 'mongoose';

export interface PokemonSchema {
	forms: string[];
	types: string[];
	sprite: string;
	evolution_chain: string[];
	number: number;
	name: string;
	display_name: string;
	generation: string;
	description: string;
}

export const Pokemon = mongoose.model(
	'Pokemon',
	new mongoose.Schema<PokemonSchema>({
		name: String,
		display_name: String,
		number: Number,
		generation: String,
		evolution_chain: [String],
		description: String,
		types: [String],
		forms: [String],
		sprite: String,
	}),
);
