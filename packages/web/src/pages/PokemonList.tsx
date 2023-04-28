import classnames from 'classnames';
import { ChangeEvent, FormEvent, UIEvent, useCallback, useEffect, useState } from 'react';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, PokemonCard } from '../components';
import { api, Pokemon, Type } from '../services/api';
import { logger } from '../utils';

const TYPES_STYLE_MAP: { [type in Type]: string } = {
	bug: 'bg-type--bug',
	dark: 'bg-type--dark',
	dragon: 'bg-type--dragon',
	electric: 'bg-type--electric !text-gray-800',
	fairy: 'bg-type--fairy !text-gray-800',
	fighting: 'bg-type--fighting',
	fire: 'bg-type--fire',
	flying: 'bg-type--flying !text-gray-800',
	ghost: 'bg-type--ghost',
	grass: 'bg-type--grass !text-gray-800',
	ground: 'bg-type--ground !text-gray-800',
	ice: 'bg-type--ice !text-gray-800',
	normal: 'bg-type--normal !text-gray-800',
	poison: 'bg-type--poison',
	psychic: 'bg-type--psychic',
	rock: 'bg-type--rock',
	steel: 'bg-type--steel !text-gray-800',
	water: 'bg-type--water',
};

interface LoadPokemonListParams {
	search_: string;
	types_: string[];
	page_?: number;
	reset?: boolean;
}

export function PokemonList() {
	let typingTimeout: ReturnType<typeof setTimeout>;

	const { generationName: generation } = useParams();
	const navigate = useNavigate();

	const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
	const [search, setSearch] = useState('');
	const [types, setTypes] = useState<Type[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<Type[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [totalPokemons, setTotalPokemons] = useState(0);

	// TODO: Move it to SSR
	const loadTypes = useCallback(async () => {
		try {
			const response = await api.getTypes();
			setTypes(response);
		} catch (error) {
			logger.error(error);
		}
	}, []);

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

	// TODO: Move it to SSR
	useEffect(() => {
		loadTypes();
		loadPokemonList();
	}, [loadPokemonList, loadTypes]);

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
		<div className="grid h-full gap-2">
			<Button
				className="flex items-center gap-2 !text-black justify-self-start bg-zinc-300"
				onClick={() => navigate(-1)}
			>
				<FiArrowLeft size={20} />
				BACK
			</Button>

			<div className="grid gap-2 lg:gap-3 lg:grid-cols-[1fr_2fr]">
				<form onSubmit={handleSubmit} className="flex gap-1 lg:flex-col">
					<div className="flex items-center flex-1 gap-4 px-3 py-4 transition-colors border rounded bg-gray-100/95 border-black/25 hover:border-black/90">
						<FiSearch size={20} className="text-gray-500 stroke-[3px]" />
						<input
							placeholder="Name or Number"
							value={search}
							onChange={onChangeSearch}
							className="w-full bg-transparent"
						/>
					</div>

					<p className="flex flex-col items-center justify-center p-1 rounded bg-gray-100/75">
						<span>Total pokémon found </span>
						<strong>{totalPokemons}</strong>
					</p>
				</form>

				<div className="grid grid-cols-5 gap-1 lg:grid-cols-6 lg:gap-x-2">
					{types.map(type => (
						<Button
							key={type}
							className={classnames(
								'uppercase text-xs !font-bold border-2 border-gray-500',
								TYPES_STYLE_MAP[type],
								{ 'border-red-600': selectedTypes.includes(type) },
							)}
							onClick={() => selectType(type)}
						>
							{type}
						</Button>
					))}
				</div>
			</div>

			<div
				className="grid grid-cols-3 gap-2 overflow-y-auto lg:gap-3 lg:grid-cols-4"
				onScroll={handleScroll}
			>
				{pokemonList.map(pokemon => (
					<PokemonCard key={pokemon.number} pokemon={pokemon} />
				))}
			</div>
		</div>
	);
}
