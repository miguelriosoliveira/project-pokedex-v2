const Generation = require('../models/Generation');
const Pokemon = require('../models/Pokemon');
const { generationNames } = require('../utils/Utils');

module.exports = {
	async getAll(request, response) {
		const genList = await Generation.find({}, 'name starters').sort('number');
		const starters = await Pokemon.find(
			{ number: { $in: genList.flatMap(gen => gen.starters) } },
			'name number',
		).sort('number');

		return response.json(
			genList.map(({ name }, index) => {
				const iniPos = index * 3;
				return {
					name,
					displayName: generationNames[name].arabic,
					starters: starters.slice(iniPos, iniPos + 3),
				};
			}),
		);
	},
};
