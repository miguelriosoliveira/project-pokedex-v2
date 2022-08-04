import { Request, Response } from 'express';

import { GENERATION_NAMES } from '../config/constants';
import { Generation, Pokemon } from '../models';

export const GenerationController = {
	async getAll(request: Request, response: Response) {
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
					displayName: GENERATION_NAMES[name].arabic,
					starters: starters.slice(iniPos, iniPos + 3),
				};
			}),
		);
	},
};
