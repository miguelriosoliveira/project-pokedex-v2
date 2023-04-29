import { TypeSchema } from '../models';

export abstract class TypesRepository {
	abstract findManyByNames(types: string[]): Promise<TypeSchema[]>;
}
