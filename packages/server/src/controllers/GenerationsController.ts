import { Request, Response } from 'express';

import { GENERATION_NAMES } from '../config/constants';
import { Generation, Pokemon } from '../models';

export const GenerationController = {
	async getAll(request: Request, response: Response) {
		const genList = await Generation.find({}, 'name region starters').sort('number');
		const starters = await Pokemon.find(
			{ number: { $in: genList.flatMap(gen => gen.starters) } },
			'name number sprite',
		).sort('number');

		return response.json(
			genList.map(({ name, region }, index) => {
				const iniPos = index * 3;
				return {
					name,
					region,
					displayName: GENERATION_NAMES[name].arabic,
					starters: starters.slice(iniPos, iniPos + 3),
				};
			}),
		);
	},
};
