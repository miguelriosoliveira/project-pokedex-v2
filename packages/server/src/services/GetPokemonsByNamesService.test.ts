import { PokemonsRepositoryInMemory } from '../repositories';
import { createPokemon } from '../utils/tests/pokemon';
import { GetPokemonsByNamesService } from './GetPokemonsByNamesService';

describe('GetPokemonsByNamesService', () => {
	it('should find pokemon by name', async () => {
		// Arrange
		const pokemonsRepository = new PokemonsRepositoryInMemory();
		pokemonsRepository.pokemons = [createPokemon({ name: 'pikachu' })];
		const getPokemonsByNamesService = new GetPokemonsByNamesService(pokemonsRepository);

		// Act
		const pokemons = await getPokemonsByNamesService.execute(['pikachu']);

		// Assert
		expect(pokemons).toHaveLength(1);
		expect(pokemons[0].name).toBe('pikachu');
	});

	it('should not find pokemon by name', async () => {
		// Arrange
		const pokemonsRepository = new PokemonsRepositoryInMemory();
		pokemonsRepository.pokemons = [createPokemon({ name: 'pikachu' })];
		const getPokemonsByNamesService = new GetPokemonsByNamesService(pokemonsRepository);

		// Act
		const pokemons = await getPokemonsByNamesService.execute(['charmander']);

		// Assert
		expect(pokemons).toHaveLength(0);
	});

	it('should find two out of three pokemon', async () => {
		// Arrange
		const pokemonsRepository = new PokemonsRepositoryInMemory();
		pokemonsRepository.pokemons = [
			createPokemon({ name: 'pikachu' }),
			createPokemon({ name: 'charmander' }),
		];
		const getPokemonsByNamesService = new GetPokemonsByNamesService(pokemonsRepository);

		// Act
		const pokemons = await getPokemonsByNamesService.execute(['pikachu', 'charmander', 'mew']);

		// Assert
		expect(pokemons).toHaveLength(2);
		expect(pokemons).toContainEqual(expect.objectContaining({ name: 'pikachu' }));
		expect(pokemons).toContainEqual(expect.objectContaining({ name: 'charmander' }));
	});
});
