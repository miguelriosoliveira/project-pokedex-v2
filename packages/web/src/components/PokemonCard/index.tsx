import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import { routes } from '../../config';
import { Pokemon, Type } from '../../services';
import { Sprite } from '../Sprite';

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

interface PokemonCardProps {
	pokemon: Pokemon;
}

export function PokemonCard({ pokemon, ...props }: PokemonCardProps) {
	const navigate = useNavigate();

	return (
		<button
			type="button"
			className="text-white transition bg-white border-2 border-black rounded-lg cursor-pointer hover:brightness-105 hover:border-zinc-500"
			onClick={() => navigate(routes.pokemonDetails(pokemon.number))}
			{...props}
		>
			<p className="font-bold bg-black">
				{pokemon.displayName} #{pokemon.number}
			</p>

			<Sprite className="sprite" name={pokemon.displayName} imgSrc={pokemon.sprite} />

			<div
				className={classNames(
					'border-t border-black grid grid-flow-col gap-2 py-1 justify-center rounded-b-md',
					TYPES_STYLE_MAP[pokemon.types[0]],
				)}
			>
				{pokemon.types.map(type => (
					<p
						key={type}
						className={classNames(
							'text-white uppercase font-bold text-xs p-2 rounded',
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
