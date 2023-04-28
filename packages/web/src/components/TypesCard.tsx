import { ReactNode } from 'react';

import { Type } from '../services';

import { TypeButton } from '.';

interface Props {
	title: ReactNode;
	types: Type[];
}

export function TypesCard({ title, types }: Props) {
	return (
		<div className="grid gap-2">
			<p className="font-medium">{title}</p>

			<div className="grid grid-cols-4 gap-2 lg:grid-cols-6">
				{types.map(type => (
					<TypeButton key={type} className="!font-normal !border-0">
						{type}
					</TypeButton>
				))}
			</div>
		</div>
	);
}
