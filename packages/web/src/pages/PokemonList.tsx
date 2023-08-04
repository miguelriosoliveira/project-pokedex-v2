import classnames from 'classnames';
import { ChangeEvent, FormEvent, UIEvent, useCallback, useState } from 'react';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import { LoaderFunctionArgs, useLoaderData, useNavigate, useParams } from 'react-router-dom';

import { Button, PokemonCard, TypeButton } from '../components';
import { Pokemon, Type, api } from '../services/api';
import { logger } from '../utils';

export async function pokemonListLoader({ params: { generationName } }: LoaderFunctionArgs) {
	const types = await api.getTypes();
	const pokemons = await api.getPokemonList({ generation: generationName });
	return { types, pokemons };
}

interface LoadPokemonListParams {
	search_: string;
	types_: string[];
	page_?: number;
	reset?: boolean;
}

let typingTimeout: ReturnType<typeof setTimeout>;

export function PokemonList() {
	const { generationName: generation } = useParams();
	const navigate = useNavigate();
	const { types, pokemons } = useLoaderData() as Awaited<ReturnType<typeof pokemonListLoader>>;

	const [pokemonList, setPokemonList] = useState<Pokemon[]>(pokemons.items);
	const [search, setSearch] = useState('');
	const [selectedTypes, setSelectedTypes] = useState<Type[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [totalPokemons, setTotalPokemons] = useState(pokemons.total);

	const loadPokemonList = useCallback(
		async ({ search_, types_, page_ = 1, reset = false } = {} as LoadPokemonListParams) => {
			setPage(page_);
			setLoading(true);
			try {
				const { items: pokeList, total } = await api.getPokemonList({
					generation,
					search: search_,
					types: types_,
					page: page_,
				});
				setPokemonList(prevPokemonList => (reset ? pokeList : [...prevPokemonList, ...pokeList]));
				setTotalPokemons(total);
			} catch (error) {
				logger.error(error, 'Failed getting pokemon list');
				return;
			} finally {
				setLoading(false);
			}
		},
		[generation],
	);

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		clearTimeout(typingTimeout);
		loadPokemonList({ search_: search, types_: selectedTypes, reset: true });
	}

	function onChangeSearch({ target: { value: newSearch } }: ChangeEvent<HTMLInputElement>) {
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}
		typingTimeout = setTimeout(
			() => loadPokemonList({ search_: newSearch, types_: selectedTypes, reset: true }),
			500,
		);
		setSearch(newSearch);
	}

	function selectType(type: Type) {
		let newSelectedTypes = [...selectedTypes];
		if (newSelectedTypes.includes(type)) {
			newSelectedTypes = newSelectedTypes.filter(t => t !== type);
		} else {
			newSelectedTypes.push(type);
		}
		setSelectedTypes(newSelectedTypes);
		loadPokemonList({ search_: search, types_: newSelectedTypes, reset: true });
	}

	function handleScroll({ currentTarget: element }: UIEvent<HTMLElement>) {
		if (loading) {
			return;
		}
		if (element.scrollHeight - element.scrollTop - element.clientHeight < 200) {
			loadPokemonList({ search_: search, types_: selectedTypes, page_: page + 1 });
		}
	}

	return (
		<div className="h-full flex flex-col gap-2">
			<Button
				className="self-start flex items-center gap-2 justify-self-start bg-zinc-300 !text-black"
				onClick={() => navigate(-1)}
			>
				<FiArrowLeft size={20} />
				BACK
			</Button>

			<div className="grid gap-2 lg:grid-cols-[1fr_2fr] lg:gap-3">
				<form onSubmit={handleSubmit} className="flex gap-1 lg:flex-col">
					<div className="flex flex-1 items-center gap-4 rounded border border-black/25 bg-gray-100/95 px-3 py-4 transition-colors hover:border-black/90">
						<FiSearch size={20} className="stroke-[3px] text-gray-500" />
						<input
							placeholder="Name or Number"
							value={search}
							onChange={onChangeSearch}
							className="w-full bg-transparent outline-none"
						/>
					</div>

					<p className="flex flex-col items-center justify-center rounded bg-gray-100/75 p-1">
						<span>Total pokémon found </span>
						<strong>{totalPokemons}</strong>
					</p>
				</form>

				<div className="grid grid-cols-5 gap-1 lg:grid-cols-6 lg:gap-x-2">
					{types.map(type => (
						<TypeButton
							key={type}
							className={classnames({ 'border-red-600': selectedTypes.includes(type) })}
							onClick={() => selectType(type)}
						>
							{type}
						</TypeButton>
					))}
				</div>
			</div>

			<div
				className="grid grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3 overflow-y-auto rounded-lg"
				onScroll={handleScroll}
			>
				{pokemonList.map(pokemon => (
					<PokemonCard key={pokemon.number} pokemon={pokemon} />
				))}
			</div>
		</div>
	);
}
