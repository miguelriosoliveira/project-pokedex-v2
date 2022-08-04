const Type = require('../models/Type');

module.exports = {
	async getAll(request, response) {
		const types = await Type.find({}, { _id: 0, name: 1 }).sort('name');
		return response.json(types.map(({ name }) => name));
	},
};
