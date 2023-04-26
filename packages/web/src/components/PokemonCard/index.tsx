import { useNavigate } from 'react-router-dom';

import { routes } from '../../config';
import { Pokemon } from '../../services';
import { Sprite } from '../Sprite';

interface PokemonCardProps {
	pokemon: Pokemon;
}

export function PokemonCard({ pokemon, ...props }: PokemonCardProps) {
	const navigate = useNavigate();

	return (
		<button
			type="button"
			className="pokemon-card-component"
			onClick={() => navigate(routes.pokemonDetails(pokemon.number))}
			{...props}
		>
			<p>
				{pokemon.displayName} #{pokemon.number}
			</p>

			<Sprite className="sprite" name={pokemon.displayName} imgSrc={pokemon.sprite} />

			<div className={`types type--${pokemon.types[0]}`}>
				{pokemon.types.map(type => (
					<p key={type} className={`type type--${type}`}>
						{type}
					</p>
				))}
			</div>
		</button>
	);
}
