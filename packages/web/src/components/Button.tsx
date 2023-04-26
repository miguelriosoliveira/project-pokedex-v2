import classNames from 'classnames';
import { HTMLAttributes } from 'react';

export function Button({ children, className, ...props }: HTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			type="button"
			className={classNames(
				'px-3 py-2 text-sm font-medium text-white transition bg-blue-700 rounded-md shadow hover:shadow-lg hover:brightness-95',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
