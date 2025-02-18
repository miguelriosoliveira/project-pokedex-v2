import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import { routes } from '../config';
import { Pokemon } from '../services';

import { ButtonProps } from './Button';
import { Sprite } from './Sprite';
import { TYPES_STYLE_MAP } from './typesStyleMap';

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
