import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import { routes } from '../config';
import { Pokemon, Type } from '../services';

import { ButtonProps } from './Button';
import { Sprite } from './Sprite';

const TYPES_STYLE_MAP: { [type in Type]: string } = {
	bug: 'bg-type--bug',
	dark: 'bg-type--dark',
	dragon: 'bg-type--dragon',
	electric: 'bg-type--electric text-gray-800',
	fairy: 'bg-type--fairy text-gray-800',
	fighting: 'bg-type--fighting',
	fire: 'bg-type--fire',
	flying: 'bg-type--flying text-gray-800',
	ghost: 'bg-type--ghost',
	grass: 'bg-type--grass text-gray-800',
	ground: 'bg-type--ground text-gray-800',
	ice: 'bg-type--ice text-gray-800',
	normal: 'bg-type--normal text-gray-800',
	poison: 'bg-type--poison',
	psychic: 'bg-type--psychic',
	rock: 'bg-type--rock',
	steel: 'bg-type--steel text-gray-800',
	water: 'bg-type--water',
};

interface PokemonCardProps extends ButtonProps {
	pokemon: Pokemon;
}

export function PokemonCard({ pokemon, className, ...props }: PokemonCardProps) {
	const navigate = useNavigate();

	return (
		<button
			type="button"
			className={classNames(
				'cursor-pointer rounded-lg border-2 border-black bg-white text-white transition hover:border-zinc-500 hover:brightness-105 shadow-md shadow-black/70',
				className,
			)}
			onClick={() => navigate(routes.pokemonDetails(pokemon.number))}
			{...props}
		>
			<p className="rounded-t-md bg-black p-1 font-bold">
				{pokemon.display_name} #{pokemon.number}
			</p>

			<Sprite name={pokemon.display_name} imgSrc={pokemon.sprite} />

			<div
				className={classNames(
					'grid grid-flow-col justify-center rounded-b-md border-t border-black py-1 lg:gap-2',
					TYPES_STYLE_MAP[pokemon.types[0]],
				)}
			>
				{pokemon.types.map(type => (
					<p
						key={type}
						className={classNames(
							'rounded p-2 text-xs font-bold uppercase text-white',
							TYPES_STYLE_MAP[type],
						)}
					>
						{type}
					</p>
				))}
			</div>
		</button>
	);
}
