import { TypesRepositoryInMemory } from '../repositories';
import { createType } from '../utils/tests';

import { GetAllTypesService } from './GetAllTypesService';

describe('GetAllTypesService', () => {
	it('should find all types sorted by name', async () => {
		// Arrange
		const typesRepository = new TypesRepositoryInMemory();
		typesRepository.types = [
			createType({ name: 'grass' }),
			createType({ name: 'fire' }),
			createType({ name: 'water' }),
		];
		const getAllTypesService = new GetAllTypesService(typesRepository);

		// Act
		const types = await getAllTypesService.execute();

		// Assert
		expect(types).toHaveLength(3);
		expect(types).toStrictEqual([
			expect.objectContaining({ name: 'fire' }),
			expect.objectContaining({ name: 'grass' }),
			expect.objectContaining({ name: 'water' }),
		]);
	});
});
