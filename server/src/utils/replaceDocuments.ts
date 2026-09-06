interface CatalogModel {
	modelName: string;
	bulkWrite(operations: unknown[]): Promise<unknown>;
	deleteMany(filter: Record<string, unknown>): Promise<unknown>;
}

export async function replaceDocuments<T extends object>(
	model: CatalogModel,
	key: keyof T & string,
	documents: T[],
) {
	if (documents.length === 0) {
		throw new Error(`Refusing to replace ${model.modelName} with an empty catalog`);
	}

	await model.bulkWrite(
		documents.map(document => ({
			updateOne: {
				filter: { [key]: document[key] },
				update: { $set: document },
				upsert: true,
			},
		})),
	);

	await model.deleteMany({
		[key]: { $nin: documents.map(document => document[key]) },
	});
}
