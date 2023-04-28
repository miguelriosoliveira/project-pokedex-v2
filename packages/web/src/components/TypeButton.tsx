import classnames from 'classnames';

import { Type } from '../services';

import { Button, ButtonProps } from './Button';

const TYPES_STYLE_MAP: { [type in Type]: string } = {
	bug: 'bg-type--bug',
	dark: 'bg-type--dark',
	dragon: 'bg-type--dragon',
	electric: 'bg-type--electric !text-gray-800',
	fairy: 'bg-type--fairy !text-gray-800',
	fighting: 'bg-type--fighting',
	fire: 'bg-type--fire',
	flying: 'bg-type--flying !text-gray-800',
	ghost: 'bg-type--ghost',
	grass: 'bg-type--grass !text-gray-800',
	ground: 'bg-type--ground !text-gray-800',
	ice: 'bg-type--ice !text-gray-800',
	normal: 'bg-type--normal !text-gray-800',
	poison: 'bg-type--poison',
	psychic: 'bg-type--psychic',
	rock: 'bg-type--rock',
	steel: 'bg-type--steel !text-gray-800',
	water: 'bg-type--water',
};

interface Props extends ButtonProps {
	children: Type;
}

export function TypeButton({ children: type, className, ...props }: Props) {
	return (
		<Button
			key={type}
			className={classnames(
				'uppercase text-xs !font-bold border-2 border-gray-500',
				TYPES_STYLE_MAP[type],
				className,
			)}
			{...props}
		>
			{type}
		</Button>
	);
}
