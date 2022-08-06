type PokemonId = number | ':pokemonId';

export const routes = {
	home: () => '/',
	search: () => '/search',
	pokemonList: (generationName = ':generationName') => `/${generationName}`,
	pokemonDetails: (pokemonId: PokemonId = ':pokemonId') => `/pokemon/${pokemonId}`,
};
