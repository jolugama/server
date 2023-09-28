import { Abilities, Superhero, Universe } from "../interfaces/superhero";

export function isSuperhero(data: Superhero | any, checkId: boolean = true): data is Superhero {
  const validAbilities = Object.values(Abilities);
  const validUniverse = Object.values(Universe);

  return (
    (!checkId || (checkId && typeof data.id === 'number')) &&
    typeof data.name === 'string' &&
    // typeof data.alias === 'string' &&
    typeof data.description === 'string' &&
    validUniverse.includes(data.universe) &&
    Array.isArray(data.abilities) &&
    data.abilities.every((ability: Abilities) => validAbilities.includes(ability)) &&
    (data.firstAppearance ? typeof data.firstAppearance === 'string' : true) &&
    (data.teams ? Array.isArray(data.teams) && data.teams.every((team: any) => typeof team === 'string') : true)
  );
}
