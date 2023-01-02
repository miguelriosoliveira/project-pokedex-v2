import mongoose from 'mongoose';

export interface GenerationSchema {
	name: string;
	number: number;
	starters: [number, number, number];
}

export const Generation = mongoose.model(
	'Generation',
	new mongoose.Schema<GenerationSchema>({
		name: String,
		number: Number,
		starters: [Number],
	}),
);
