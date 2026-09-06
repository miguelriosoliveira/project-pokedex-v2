import type { Request, Response } from 'express';

import { Generation, Pokemon } from '../models';

export const GenerationController = {
	async getAll(_request: Request, response: Response) {
		const genList = await Generation.find({}, 'name region display_name starters').sort('number');
		const starters = await Pokemon.find(
			{ number: { $in: genList.flatMap(gen => gen.starters) } },
			'-_id name number sprite',
		).sort('number');

		return response.json(
			genList.map(({ name, region, display_name }, index) => {
				const iniPos = index * 3;
				return {
					name,
					region,
					display_name,
					starters: starters.slice(iniPos, iniPos + 3),
				};
			}),
		);
	},
};
