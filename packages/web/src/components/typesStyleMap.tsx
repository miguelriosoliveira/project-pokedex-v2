import { Type } from '../services';

export const TYPES_STYLE_MAP: {
	[type in Type]: string;
} = {
	bug: 'bg-type--bug',
	dark: 'bg-type--dark',
	dragon: 'bg-linear-to-b from-[#53a4cf] from-50% to-[#f16e57] to-50%',
	electric: 'bg-type--electric !text-gray-800',
	fairy: 'bg-type--fairy !text-gray-800',
	fighting: 'bg-type--fighting',
	fire: 'bg-type--fire',
	flying: 'bg-linear-to-b from-[#3dc7ef] from-50% to-[#bdb9b8] to-50% !text-gray-800',
	ghost: 'bg-type--ghost',
	grass: 'bg-type--grass !text-gray-800',
	ground: 'bg-linear-to-b from-[#f7de3f] from-50% to-[#ab9842] to-50% !text-gray-800',
	ice: 'bg-type--ice !text-gray-800',
	normal: 'bg-type--normal !text-gray-800',
	poison: 'bg-type--poison',
	psychic: 'bg-type--psychic',
	rock: 'bg-type--rock',
	steel: 'bg-type--steel !text-gray-800',
	water: 'bg-type--water',
};
