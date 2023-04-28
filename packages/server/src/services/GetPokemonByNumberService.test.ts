import { PokemonsRepositoryInMemory } from '../repositories';
import { createPokemon } from '../utils/tests/pokemon';
import { GetPokemonByNumberService } from './GetPokemonByNumberService';

describe('GetPokemonByNumberService', () => {
	it('should find pokemon by number', async () => {
		// Arrange
		const pokemonsRepository = new PokemonsRepositoryInMemory();
		pokemonsRepository.pokemons = [createPokemon({ name: 'mewtwo', number: 150 })];
		const getPokemonByNumberService = new GetPokemonByNumberService(pokemonsRepository);

		// Act
		const pokemon = await getPokemonByNumberService.execute(150);

		// Assert
		expect(pokemon.name).toBe('mewtwo');
	});

	it('should not find pokemon by number', async () => {
		// Arrange
		const pokemonsRepository = new PokemonsRepositoryInMemory();
		pokemonsRepository.pokemons = [createPokemon({ name: 'mewtwo', number: 150 })];
		const getPokemonByNumberService = new GetPokemonByNumberService(pokemonsRepository);

		// Act + Assert
		expect(() => getPokemonByNumberService.execute(-1)).rejects.toThrow('Pokémon #-1 not found!');
	});
});
