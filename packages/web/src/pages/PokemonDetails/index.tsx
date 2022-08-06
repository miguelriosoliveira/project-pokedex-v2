import { ArrowBack, ArrowRight, ReportProblem } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PokemonCard, Sprite } from '../../components';
import { api, PokemonDetails as PokemonData } from '../../services';
import { logger } from '../../utils';

import styles from './styles.module.scss';

export function PokemonDetails() {
	const navigate = useNavigate();
	const { pokemonId: id } = useParams();
	const pokemonId = Number(id);

	const [pokemon, setPokemon] = useState<PokemonData>({} as PokemonData);

	useEffect(() => {
		const loadPokemon = async () => {
			try {
				const pokemonDetails = await api.getPokemon(pokemonId);
				setPokemon(pokemonDetails);
			} catch (error) {
				logger.error(error, 'Failed getting pokemon details');
			}
		};

		loadPokemon();
	}, [pokemonId]);

	if (Number.isNaN(pokemonId)) {
		return null;
	}

	const { common: commonEvolutions, variant: variantEvolutions } = pokemon.evolutionChain;

	return (
		pokemon && (
			<div className={styles['pokemon-details-component']}>
				<div className="header">
					<Button
						variant="contained"
						// color="default"
						startIcon={<ArrowBack />}
						onClick={() => navigate(-1)}
					>
						Back
					</Button>
				</div>

				<div className="main">
					<div className="sprite">
						<Sprite name={pokemon.name} number={pokemon.number} />
					</div>

					<div className="infos">
						<Typography variant="h4" className="name">
							{pokemon.name} #{pokemon.number}
						</Typography>

						<div className="description">
							<Typography variant="body1" className="text--bold">
								{pokemon.description}
							</Typography>
						</div>

						<div className="types">
							<div className="own">
								<div className="title">
									<Typography variant="body1" className="text--bold">
										{pokemon.types.length === 1 ? 'TYPE' : 'TYPES'}
									</Typography>
								</div>
								<div className="list">
									{pokemon.types.map(type => (
										<Typography
											key={type}
											align="center"
											variant="overline"
											className={`type type--${type}`}
										>
											{type}
										</Typography>
									))}
								</div>
							</div>

							<div className="weaknesses">
								<div className="title">
									<ReportProblem />
									<Typography variant="body1" className="text--bold">
										WEAKNESSES
									</Typography>
									<ReportProblem />
								</div>
								<div className="list">
									{pokemon.weaknesses.map(weakness => (
										<Typography
											key={weakness}
											align="center"
											variant="overline"
											className={`type type--${weakness}`}
										>
											{weakness}
										</Typography>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="evolution-chain">
					<Typography variant="body1" className="title text--bold">
						EVOLUTION CHAIN
					</Typography>

					<div className="list">
						<div className="common">
							{commonEvolutions.map((poke, index) => {
								return (
									<div key={poke.displayName} className="pokemon-form">
										<PokemonCard key={poke.number} pokemon={poke} />
										{index === commonEvolutions.length - 1 &&
										variantEvolutions.length === 0 ? null : (
											<ArrowRight />
										)}
									</div>
								);
							})}
						</div>

						{variantEvolutions.length > 0 && (
							<div className="variant">
								<div className="half">
									{variantEvolutions
										.slice(0, Math.floor(variantEvolutions.length / 2))
										.map(poke => (
											<PokemonCard key={poke.number} pokemon={poke} />
										))}
								</div>

								<div className="half">
									{variantEvolutions.slice(Math.ceil(variantEvolutions.length / 2)).map(poke => (
										<PokemonCard key={poke.number} pokemon={poke} />
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		)
	);
}
