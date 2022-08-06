import { ArrowBack, Search } from '@mui/icons-material';
import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import classnames from 'classnames';
import { ChangeEvent, FormEvent, UIEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PokemonCard } from '../../components';
import { api, Pokemon } from '../../services/api';
import { logger } from '../../utils';

import styles from './styles.module.scss';

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
	const [types, setTypes] = useState<string[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	// const [typingTimeout, setTypingTimeout] = useState();
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [totalPokemons, setTotalPokemons] = useState(0);

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
			console.log({ generation, search_, types_, page_, reset });

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

	useEffect(() => {
		loadTypes();
		loadPokemonList();
	}, [loadPokemonList, loadTypes]);

	function onSubmit(event: FormEvent) {
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

	function selectType(type: string) {
		let newSelectedTypes = [...selectedTypes];
		if (newSelectedTypes.includes(type)) {
			newSelectedTypes = newSelectedTypes.filter(type_ => type_ !== type);
		} else {
			newSelectedTypes.push(type);
		}
		setSelectedTypes(newSelectedTypes);
		loadPokemonList({ search_: search, types_: newSelectedTypes, reset: true });
	}

	function onScroll({ currentTarget: element }: UIEvent<HTMLElement>) {
		if (loading) {
			return;
		}
		if (element.scrollHeight - element.scrollTop - element.clientHeight < 200) {
			loadPokemonList({ search_: search, types_: selectedTypes, page_: page + 1 });
		}
	}

	return (
		<div className={styles['pokemon-list-component']}>
			<Button
				variant="contained"
				// color="default"
				className="back-button"
				startIcon={<ArrowBack />}
				onClick={() => navigate(-1)}
			>
				Back
			</Button>

			<div className="search">
				<form onSubmit={onSubmit}>
					<TextField
						placeholder="Name or Number"
						variant="outlined"
						value={search}
						onChange={onChangeSearch}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Search style={{ color: 'gray' }} />
								</InputAdornment>
							),
						}}
					/>
					<Typography>
						<span>Total pokémon found</span>
						<strong>{totalPokemons}</strong>
					</Typography>
				</form>

				<div className="types-menu">
					{types.map(type => (
						<button
							type="button"
							key={type}
							className={classnames(`type type--${type}`, {
								'type--selected': selectedTypes.includes(type),
							})}
							onClick={() => selectType(type)}
						>
							<Typography key={type} variant="overline">
								{type}
							</Typography>
						</button>
					))}
				</div>
			</div>

			<div className="list" onScroll={onScroll}>
				{pokemonList.map(pokemon => (
					<PokemonCard key={pokemon.number} pokemon={pokemon} />
				))}
			</div>
		</div>
	);
}
