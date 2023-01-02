import { Type } from '../models';

export class TypesRepository {
	async findManyByNames(types: string[]) {
		return Type.find({ name: { $in: types } });
	}
}
