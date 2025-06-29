export const POKEMON_TYPES = [
  { name: 'Normal', color: '#A8A77A' },
  { name: 'Fire', color: '#EE8130' },
  { name: 'Water', color: '#6390F0' },
  { name: 'Electric', color: '#F7D02C' },
  { name: 'Grass', color: '#7AC74C' },
  { name: 'Ice', color: '#96D9D6' },
  { name: 'Fighting', color: '#C22E28' },
  { name: 'Poison', color: '#A33EA1' },
  { name: 'Ground', color: '#E2BF65' },
  { name: 'Flying', color: '#A98FF3' },
  { name: 'Psychic', color: '#F95587' },
  { name: 'Bug', color: '#A6B91A' },
  { name: 'Rock', color: '#B6A136' },
  { name: 'Ghost', color: '#735797' },
  { name: 'Dragon', color: '#6F35FC' },
  { name: 'Dark', color: '#705746' },
  { name: 'Steel', color: '#B7B7CE' },
  { name: 'Fairy', color: '#D685AD' },
];

const types = POKEMON_TYPES.map(t => t.name);

// Attacker -> Defender -> Multiplier
const chart: { [key: string]: { [key: string]: number } } = {
  Normal:   { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire:     { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water:    { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass:    { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice:      { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison:   { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground:   { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying:   { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic:  { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug:      { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock:     { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost:    { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon:   { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark:     { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel:    { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy:    { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 },
};

export const TYPE_CHART: { [key: string]: { [key: string]: number } } = {};

types.forEach(attacker => {
  TYPE_CHART[attacker] = {};
  types.forEach(defender => {
    TYPE_CHART[attacker][defender] = chart[attacker]?.[defender] ?? 1;
  });
});

export const getEffectiveness = (attackingType: string, defendingType: string): { multiplier: number; label: string } => {
  const multiplier = TYPE_CHART[attackingType][defendingType];
  let label = 'Normal';
  if (multiplier === 2) label = 'Super Effective';
  if (multiplier === 0.5) label = 'Not Very Effective';
  if (multiplier === 0) label = 'No Effect';
  return { multiplier, label };
};

export const getCombinedEffectiveness = (
  attackingType: string,
  defendingTypes: string[]
): { multiplier: number; label: string } => {
  if (defendingTypes.length === 0) {
    return { multiplier: 1, label: 'Normal' };
  }

  const multiplier = defendingTypes.reduce((acc, defender) => {
    return acc * (TYPE_CHART[attackingType]?.[defender] ?? 1);
  }, 1);

  let label = `${multiplier}x Damage`;
  if (multiplier === 4) label = '4x Super Effective';
  if (multiplier === 2) label = '2x Super Effective';
  if (multiplier === 1) label = 'Normal Damage';
  if (multiplier === 0.5) label = '0.5x Not Very Effective';
  if (multiplier === 0.25) label = '0.25x Not Very Effective';
  if (multiplier === 0) label = 'No Effect';

  return { multiplier, label };
};


export const getTypeColor = (typeName: string): string => {
  return POKEMON_TYPES.find(t => t.name === typeName)?.color || '#FFFFFF';
};
