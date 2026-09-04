import mongoose from 'mongoose';

export interface GenerationSchema {
	name: string;
	number: number;
	region: string;
	starters: [number, number, number];
}

export const Generation = mongoose.model(
	'Generation',
	new mongoose.Schema<GenerationSchema>({
		name: String,
		number: Number,
		region: String,
		starters: [Number],
	}),
);
