import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export function ErrorElement() {
	const error = useRouteError();
	const errorMsg = isRouteErrorResponse(error)
		? error.data
		: "Oops... Something unexpected happening, we're taking a look right now!";
	return (
		<h6 className="rounded-lg border-2 border-black bg-white p-6 text-center font-bold uppercase">
			{errorMsg}
		</h6>
	);
}
