import { HTMLAttributes } from 'react';

interface SpriteProps extends HTMLAttributes<HTMLImageElement> {
	name: string;
	number: number;
}

export function Sprite({ name, number, ...props }: SpriteProps) {
	const threeDigitNumber = number.toString().padStart(3, '0');
	return (
		<img
			src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${threeDigitNumber}.png`}
			alt={name}
			{...props}
		/>
	);
}
