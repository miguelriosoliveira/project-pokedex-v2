import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { GoAlert } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, PokemonCard, Sprite, TypesCard } from '../../components';
import { PokemonDetails as PokemonData, api } from '../../services';
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
	const warningSign = <GoAlert size={20} />;

	return (
		<div className="font-medium">
			<Button
				className="flex items-center gap-2 !text-black justify-self-start bg-zinc-300"
				onClick={() => navigate(-1)}
			>
				<FiArrowLeft size={20} />
				BACK
			</Button>

			<div>
				<div className="max-w-xs bg-white border-2 border-black rounded-full">
					<Sprite name={pokemon.name} imgSrc={pokemon.sprite} />
				</div>

				<div>
					<h1 className="text-3xl font-bold drop-shadow">
						{pokemon.name} #{pokemon.number}
					</h1>

					<p className="drop-shadow">{pokemon.description}</p>

					<div className="rounded-md bg-gray-100/90">
						<TypesCard title="TYPES" types={pokemon.types} />

						<TypesCard
							title={
								<div className="flex items-center gap-1">
									{warningSign}
									WEAKNESSES
									{warningSign}
								</div>
							}
							types={pokemon.weaknesses}
						/>
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
