import { ReactNode } from 'react';

import { Type } from '../services';

import { TypeButton } from './TypeButton';

interface Props {
	title: ReactNode;
	types: Type[];
}

export function TypesCard({ title, types }: Props) {
	return (
		<div className="grid gap-2">
			<h3 className="font-medium">{title}</h3>

			<div className="grid grid-cols-4 gap-2 lg:grid-cols-6">
				{types.map(type => (
					<TypeButton key={type} className="!border-0 !font-normal">
						{type}
					</TypeButton>
				))}
			</div>
		</div>
	);
}
