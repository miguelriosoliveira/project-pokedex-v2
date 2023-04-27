import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

import { PokemonCard, Sprite } from '../../components';
import { api, PokemonDetails as PokemonData } from '../../services';
import { logger } from '../../utils';

export function PokemonDetails() {
	const navigate = useNavigate();
	const { pokemonId: id } = useParams();
	const pokemonId = Number(id);
	const [pokemon, setPokemon] = useState<PokemonData | null>(null);

	// TODO: Move it to SSR
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

	if (Number.isNaN(pokemonId) || !pokemon) {
		return null;
	}

	const { common: commonEvolutions, variant: variantEvolutions } = pokemon.evolutionChain;

	return (
		<div className="pokemon-details-component">
			<header>
				<button type="button" onClick={() => navigate(-1)}>
					<FiArrowLeft scale={25} />
					Back
				</button>
			</header>

			<div className="main">
				<div className="sprite">
					<Sprite name={pokemon.name} imgSrc={pokemon.sprite} />
				</div>

				<div className="infos">
					<h4 className="name">
						{pokemon.name} #{pokemon.number}
					</h4>

					<div className="description">
						<p className="text--bold">{pokemon.description}</p>
					</div>

					<div className="types">
						<div className="own">
							<div className="title">
								<p className="text--bold">{pokemon.types.length === 1 ? 'TYPE' : 'TYPES'}</p>
							</div>
							<div className="list">
								{pokemon.types.map(type => (
									<p key={type} className={`type type--${type}`}>
										{type}
									</p>
								))}
							</div>
						</div>

						<div className="weaknesses">
							<div className="title">
								<FiAlertTriangle />
								<p className="text--bold">WEAKNESSES</p>
								<FiAlertTriangle />
							</div>
							<div className="list">
								{pokemon.weaknesses.map(weakness => (
									<p key={weakness} className={`type type--${weakness}`}>
										{weakness}
									</p>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="evolution-chain">
				<p className="title text--bold">EVOLUTION CHAIN</p>

				<div className="list">
					<div className="common">
						{commonEvolutions.map((poke, index) => {
							return (
								<div key={poke.displayName} className="pokemon-form">
									<PokemonCard key={poke.number} pokemon={poke} />
									{index === commonEvolutions.length - 1 &&
									variantEvolutions.length === 0 ? null : (
										<FiArrowRight />
									)}
								</div>
							);
						})}
					</div>

					{variantEvolutions.length > 0 && (
						<div className="variant">
							<div className="half">
								{variantEvolutions.slice(0, Math.floor(variantEvolutions.length / 2)).map(poke => (
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
	);
}
