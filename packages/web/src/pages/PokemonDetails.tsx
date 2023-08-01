import { Fragment, useEffect, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { GoAlert } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, PokemonCard, Sprite, TypesCard } from '../components';
import { PokemonDetails as PokemonData, api } from '../services';
import { logger } from '../utils';

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
		<div className="grid gap-4 font-medium">
			<Button
				className="flex items-center gap-2 justify-self-start bg-zinc-300 !text-black"
				onClick={() => navigate(-1)}
			>
				<FiArrowLeft size={20} />
				BACK
			</Button>

			<div className="grid justify-items-center gap-2 lg:flex lg:gap-6">
				<div className="max-w-xs rounded-full border-2 border-black bg-white">
					<Sprite className="scale-110" name={pokemon.name} imgSrc={pokemon.sprite} />
				</div>

				<div className="grid gap-3">
					<div>
						<h1 className="text-3xl font-bold drop-shadow">
							{pokemon.name} #{pokemon.number}
						</h1>
						<p className="drop-shadow">{pokemon.description}</p>
					</div>

					<div className="grid gap-4 rounded-md bg-gray-100/90 p-3">
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

			<div className="flex flex-col items-center gap-2">
				<p className="font-bold">EVOLUTION CHAIN</p>

				<div>
					<div className="flex items-center gap-1">
						{commonEvolutions.map((poke, index) => {
							return (
								<Fragment key={poke.displayName}>
									<PokemonCard key={poke.number} pokemon={poke} className="max-w-[250px]" />
									{index === commonEvolutions.length - 1 &&
									variantEvolutions.length === 0 ? null : (
										<FaCaretRight />
									)}
								</Fragment>
							);
						})}
					</div>

					{variantEvolutions.length > 0 && (
						<div className="flex flex-col gap-2">
							<div className="flex gap-2">
								{variantEvolutions.slice(0, Math.floor(variantEvolutions.length / 2)).map(poke => (
									<PokemonCard key={poke.number} pokemon={poke} />
								))}
							</div>

							<div className="flex gap-2">
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
