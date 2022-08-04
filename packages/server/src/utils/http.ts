export function getIdFromUrl(url: string) {
	return url.split('/').slice(-2, -1).pop();
}
