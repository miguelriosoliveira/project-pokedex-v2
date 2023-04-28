import { HTMLAttributes } from 'react';

interface SpriteProps extends HTMLAttributes<HTMLImageElement> {
	name: string;
	imgSrc: string;
}

export function Sprite({ name, imgSrc, ...props }: SpriteProps) {
	return <img loading="lazy" src={imgSrc} alt={name} {...props} />;
}
