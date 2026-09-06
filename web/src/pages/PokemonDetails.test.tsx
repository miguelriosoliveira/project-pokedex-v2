import { cleanup, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import type { TypeMatchups } from '../services';

import { PokemonDetails } from './PokemonDetails';

const emptyMatchups: TypeMatchups = {
	double_damage_from: [],
	half_damage_from: [],
	no_damage_from: [],
	double_damage_to: [],
	half_damage_to: [],
	no_damage_to: [],
};

const threeVariants = {
	name: 'Tyrogue',
	number: 236,
	types: ['fighting'],
	description: 'desc',
	sprite: 'tyrogue.png',
	matchups: emptyMatchups,
	evolution_chain: {
		common: [
			{
				display_name: 'Tyrogue',
				number: 236,
				sprite: 'tyrogue.png',
				types: ['fighting'],
			},
		],
		variant: [
			[
				{
					display_name: 'Hitmonlee',
					number: 106,
					sprite: 'hitmonlee.png',
					types: ['fighting'],
				},
			],
			[
				{
					display_name: 'Hitmonchan',
					number: 107,
					sprite: 'hitmonchan.png',
					types: ['fighting'],
				},
			],
			[
				{
					display_name: 'Hitmontop',
					number: 237,
					sprite: 'hitmontop.png',
					types: ['fighting'],
				},
			],
		],
	},
};

function renderDetails(pokemon: typeof threeVariants) {
	const router = createMemoryRouter(
		[
			{
				path: '/pokemon/:pokemonId',
				loader: () => pokemon,
				element: <PokemonDetails />,
			},
		],
		{ initialEntries: ['/pokemon/236'] },
	);

	return render(<RouterProvider router={router} />);
}

describe('PokemonDetails', () => {
	afterEach(() => {
		cleanup();
	});

	it('shows damage taken and dealt sections', async () => {
		renderDetails({
			...threeVariants,
			matchups: {
				...emptyMatchups,
				double_damage_from: ['fighting'],
				no_damage_from: ['ghost'],
				half_damage_to: ['rock', 'steel'],
				no_damage_to: ['ghost'],
			},
		});

		expect(await screen.findByText('DOUBLE DAMAGE FROM')).toBeInTheDocument();
		expect(screen.getByText('HALF DAMAGE TO')).toBeInTheDocument();
		expect(screen.getByText('NO DAMAGE FROM')).toBeInTheDocument();
	});

	it('shows every branched evolution', async () => {
		renderDetails(threeVariants);

		expect(await screen.findByText(/Hitmonlee/i)).toBeInTheDocument();
		expect(screen.getByText(/Hitmonchan/i)).toBeInTheDocument();
		expect(screen.getByText(/Hitmontop/i)).toBeInTheDocument();
		expect(screen.getAllByText(/^or$/i)).toHaveLength(2);
	});

	it('keeps arrows on each branched path', async () => {
		renderDetails({
			name: 'Wurmple',
			number: 265,
			types: ['bug'],
			description: 'desc',
			sprite: 'wurmple.png',
			matchups: emptyMatchups,
			evolution_chain: {
				common: [
					{
						display_name: 'Wurmple',
						number: 265,
						sprite: 'wurmple.png',
						types: ['bug'],
					},
				],
				variant: [
					[
						{
							display_name: 'Silcoon',
							number: 266,
							sprite: 'silcoon.png',
							types: ['bug'],
						},
						{
							display_name: 'Beautifly',
							number: 267,
							sprite: 'beautifly.png',
							types: ['bug', 'flying'],
						},
					],
					[
						{
							display_name: 'Cascoon',
							number: 268,
							sprite: 'cascoon.png',
							types: ['bug'],
						},
						{
							display_name: 'Dustox',
							number: 269,
							sprite: 'dustox.png',
							types: ['bug', 'poison'],
						},
					],
				],
			},
		});

		expect(await screen.findByText(/Silcoon/i)).toBeInTheDocument();
		expect(screen.getByText(/Beautifly/i)).toBeInTheDocument();
		expect(screen.getByText(/Cascoon/i)).toBeInTheDocument();
		expect(screen.getByText(/Dustox/i)).toBeInTheDocument();
		expect(screen.getAllByText(/^or$/i)).toHaveLength(1);
	});
});
