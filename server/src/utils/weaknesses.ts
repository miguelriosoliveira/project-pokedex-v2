import type { TypeSchema } from '../models';

export interface TypeMatchups {
	double_damage_from: string[];
	half_damage_from: string[];
	no_damage_from: string[];
	double_damage_to: string[];
	half_damage_to: string[];
	no_damage_to: string[];
}

function damageTaken(attackingType: string, defendingType: TypeSchema) {
	if (defendingType.no_damage_from.includes(attackingType)) {
		return 0;
	}
	if (defendingType.double_damage_from.includes(attackingType)) {
		return 2;
	}
	if (defendingType.half_damage_from.includes(attackingType)) {
		return 0.5;
	}
	return 1;
}

function damageDealt(attackingType: TypeSchema, defendingType: string) {
	if (attackingType.no_damage_to.includes(defendingType)) {
		return 0;
	}
	if (attackingType.double_damage_to.includes(defendingType)) {
		return 2;
	}
	if (attackingType.half_damage_to.includes(defendingType)) {
		return 0.5;
	}
	return 1;
}

function sortIntoBuckets(entries: Array<[string, number]>) {
	const double: string[] = [];
	const half: string[] = [];
	const none: string[] = [];

	for (const [type, multiplier] of entries) {
		if (multiplier === 0) {
			none.push(type);
		} else if (multiplier < 1) {
			half.push(type);
		} else if (multiplier >= 2) {
			double.push(type);
		}
	}

	return {
		double: double.sort(),
		half: half.sort(),
		none: none.sort(),
	};
}

export function getTypeMatchups(types: TypeSchema[]): TypeMatchups {
	const incoming = new Set(
		types.flatMap(type => [
			...type.double_damage_from,
			...type.half_damage_from,
			...type.no_damage_from,
		]),
	);
	const outgoing = new Set(
		types.flatMap(type => [...type.double_damage_to, ...type.half_damage_to, ...type.no_damage_to]),
	);

	const taken = sortIntoBuckets(
		[...incoming].map(attackingType => [
			attackingType,
			types.reduce(
				(product, defendingType) => product * damageTaken(attackingType, defendingType),
				1,
			),
		]),
	);
	const dealt = sortIntoBuckets(
		[...outgoing].map(defendingType => [
			defendingType,
			Math.max(...types.map(attackingType => damageDealt(attackingType, defendingType))),
		]),
	);

	return {
		double_damage_from: taken.double,
		half_damage_from: taken.half,
		no_damage_from: taken.none,
		double_damage_to: dealt.double,
		half_damage_to: dealt.half,
		no_damage_to: dealt.none,
	};
}

export function getWeaknesses(defendingTypes: TypeSchema[]) {
	return getTypeMatchups(defendingTypes).double_damage_from;
}
