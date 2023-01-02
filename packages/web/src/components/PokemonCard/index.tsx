import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { routes } from '../../config';
import { Pokemon } from '../../services';
import { Sprite } from '../Sprite';

import styles from './styles.module.scss';

interface PokemonCardProps {
	pokemon: Pokemon;
}

export function PokemonCard({ pokemon, ...props }: PokemonCardProps) {
	const navigate = useNavigate();

	return (
		<button
			type="button"
			className={styles['pokemon-card-component']}
			onClick={() => navigate(routes.pokemonDetails(pokemon.number))}
			{...props}
		>
			<Typography noWrap className="name">
				{pokemon.displayName} #{pokemon.number}
			</Typography>

			<Sprite className="sprite" name={pokemon.displayName} imgSrc={pokemon.sprite} />

			<div className={`types type--${pokemon.types[0]}`}>
				{pokemon.types.map(type => (
					<Typography key={type} variant="overline" className={`type type--${type}`}>
						{type}
					</Typography>
				))}
			</div>
		</button>
	);
}
