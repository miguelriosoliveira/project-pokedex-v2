import classnames from 'classnames';

import { Type } from '../services';

import { Button, ButtonProps } from './Button';
import { TYPES_STYLE_MAP } from './typesStyleMap';

interface Props extends ButtonProps {
	children: Type;
}

export function TypeButton({ children: type, className, ...props }: Props) {
	return (
		<Button
			key={type}
			className={classnames(
				'border-2 border-gray-500 text-xs !font-bold uppercase',
				TYPES_STYLE_MAP[type],
				className,
			)}
			{...props}
		>
			{type}
		</Button>
	);
}
