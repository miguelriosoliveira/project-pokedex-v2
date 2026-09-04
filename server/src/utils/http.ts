// Example URL: https://pokeapi.co/api/v2/evolution-chain/3/
export function getIdFromUrl(url: string) {
	return Number(url.split('/').at(-2));
}
