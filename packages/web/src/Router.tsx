import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { App } from './App';
import { routes } from './config';
import { Home, PokemonDetails, PokemonList } from './pages';

export function Router() {
	return (
		<App>
			<BrowserRouter>
				<Routes>
					<Route path={routes.home()} element={<Home />} />
					<Route path={routes.search()} element={<PokemonList />} />
					<Route path={routes.pokemonList()} element={<PokemonList />} />
					<Route path={routes.pokemonDetails()} element={<PokemonDetails />} />
				</Routes>
			</BrowserRouter>
		</App>
	);
}
