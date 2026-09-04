import { TypesRepositoryInMemory } from '../repositories';
import { createType } from '../utils/tests';

import { GetTypesByNamesService } from './GetTypesByNamesService';

describe('GetTypesByNamesService', () => {
	it('should find types by names', async () => {
		// Arrange
		const typesRepository = new TypesRepositoryInMemory();
		typesRepository.types = [createType({ name: 'fire' })];
		const getTypesByNamesService = new GetTypesByNamesService(typesRepository);

		// Act
		const types = await getTypesByNamesService.execute(['fire']);

		// Assert
		expect(types).toHaveLength(1);
		expect(types[0].name).toBe('fire');
	});

	it('should find two out of three types', async () => {
		// Arrange
		const typesRepository = new TypesRepositoryInMemory();
		typesRepository.types = [createType({ name: 'fire' }), createType({ name: 'water' })];
		const getTypesByNamesService = new GetTypesByNamesService(typesRepository);

		// Act
		const types = await getTypesByNamesService.execute(['grass', 'fire', 'water']);

		// Assert
		expect(types).toHaveLength(2);
		expect(types).toContainEqual(expect.objectContaining({ name: 'fire' }));
		expect(types).toContainEqual(expect.objectContaining({ name: 'water' }));
	});

	it('should not find any types', async () => {
		// Arrange
		const typesRepository = new TypesRepositoryInMemory();
		typesRepository.types = [createType({ name: 'fire' }), createType({ name: 'water' })];
		const getTypesByNamesService = new GetTypesByNamesService(typesRepository);

		// Act
		const types = await getTypesByNamesService.execute(['rock']);

		// Assert
		expect(types).toHaveLength(0);
	});
});
