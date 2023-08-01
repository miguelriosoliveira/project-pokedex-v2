import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { App } from './App';
import { ErrorElement } from './components';
import { routes } from './config';
import { Home, PokemonDetails, PokemonList } from './pages';
import { api } from './services';

export function Router() {
	return (
		<App>
			<RouterProvider
				router={createBrowserRouter([
					{
						path: routes.home(),
						element: <Home />,
						loader: api.getGenerations,
						errorElement: <ErrorElement />,
						children: [
							{
								path: routes.search(),
								element: <PokemonList />,
								// loader: pokemonListLoader,
							},
							{
								path: routes.pokemonList(),
								element: <PokemonList />,
								// loader: pokemonListLoader,
							},
							{
								path: routes.pokemonDetails(),
								element: <PokemonDetails />,
								// loader: pokemonDetailsLoader,
							},
						],
					},
				])}
			/>
		</App>
	);
}
