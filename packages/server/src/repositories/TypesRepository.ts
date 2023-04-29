import { TypeSchema } from '../models';

export abstract class TypesRepository {
	abstract findMany(): Promise<TypeSchema[]>;

	abstract findManyByNames(types: string[]): Promise<TypeSchema[]>;
}
