import { FiArrowLeft } from 'react-icons/fi';
import { type LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router-dom';

import { Button, EvolutionChain, Sprite, TypesCard } from '../components';
import { api, type Type } from '../services';

export async function pokemonDetailsLoader({ params: { pokemonId } }: LoaderFunctionArgs) {
	return api.getPokemon(Number(pokemonId));
}

export function PokemonDetails() {
	const navigate = useNavigate();
	const pokemon = useLoaderData() as Awaited<ReturnType<typeof pokemonDetailsLoader>>;

	if (!pokemon) {
		return null;
	}

	const { common: commonEvolutions, variant: variantEvolutions } = pokemon.evolution_chain;
	const { matchups } = pokemon;

	return (
		<div className="grid gap-4 font-medium">
			<Button
				className="flex items-center gap-2 justify-self-start bg-zinc-300 text-black!"
				onClick={() => navigate(-1)}
			>
				<FiArrowLeft size={20} />
				BACK
			</Button>

			<div className="grid justify-items-center gap-2 lg:flex lg:gap-6">
				<div className="w-80 shrink-0 rounded-full border-2 border-black bg-white shadow-md shadow-black/70">
					<Sprite className="w-full scale-110" name={pokemon.name} imgSrc={pokemon.sprite} />
				</div>

				<div className="grid min-w-0 gap-3">
					<div>
						<h1 className="text-3xl font-bold drop-shadow">
							{pokemon.name} #{pokemon.number}
						</h1>
						<p className="drop-shadow">{pokemon.description}</p>
					</div>

					<div className="grid gap-4 rounded-md bg-gray-100/90 p-3">
						<TypesCard title="TYPES" types={pokemon.types} />
					</div>
				</div>
			</div>

			<div className="grid gap-4 rounded-md bg-gray-100/90 p-3 lg:grid-cols-2">
				<MatchupGroup
					cards={[
						['DOUBLE DAMAGE FROM', matchups.double_damage_from],
						['HALF DAMAGE FROM', matchups.half_damage_from],
						['NO DAMAGE FROM', matchups.no_damage_from],
					]}
				/>
				<MatchupGroup
					cards={[
						['DOUBLE DAMAGE TO', matchups.double_damage_to],
						['HALF DAMAGE TO', matchups.half_damage_to],
						['NO DAMAGE TO', matchups.no_damage_to],
					]}
				/>
			</div>

			<EvolutionChain common={commonEvolutions} variants={variantEvolutions} />
		</div>
	);
}

function MatchupGroup({ cards }: { cards: Array<[string, Type[]]> }) {
	return (
		<div className="grid gap-3">
			{cards.map(([label, types]) => (
				<TypesCard key={label} title={label} types={types} />
			))}
		</div>
	);
}
