import mongoose from 'mongoose';

export interface GenerationSchema {
	name: string;
	number: number;
	region: string;
	display_name: string;
	starters: [number, number, number];
}

export const Generation = mongoose.model(
	'Generation',
	new mongoose.Schema<GenerationSchema>({
		name: String,
		number: Number,
		region: String,
		display_name: String,
		starters: [Number],
	}),
);
