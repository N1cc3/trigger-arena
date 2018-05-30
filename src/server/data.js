import CardAttribute from './CardAttribute'
import Card from './Card'

class TriggerType extends CardAttribute {}
class EffectType extends CardAttribute {}
class TargetType extends CardAttribute {}

export const TRIGGER_TYPES = [
  {value: new TriggerType('instant', 'Instant'), frequency: 5},
  {value: new TriggerType('everyTurn', 'On Every ? Turn', [
    {value: {value: 1}, frequency: 1},
    {value: {value: 2}, frequency: 3},
    {value: {value: 3}, frequency: 5},
    {value: {value: 4}, frequency: 7},
    {value: {value: 5}, frequency: 9},
  ]), frequency: 2},
  {value: new TriggerType('dealsDmg', 'Deals Damage To Other'), frequency: 3},
  {value: new TriggerType('takesDmg', 'Takes Damage'), frequency: 3},
  {value: new TriggerType('heals', 'Heals'), frequency: 3},
  {value: new TriggerType('isHealed', 'Is Healed'), frequency: 3},
]

export const EFFECT_TYPES = [
  {value: new EffectType('damage', 'Deal ? damage', [
    {value: {value: 1}, frequency: 9},
    {value: {value: 2}, frequency: 7},
    {value: {value: 3}, frequency: 5},
    {value: {value: 4}, frequency: 3},
    {value: {value: 5}, frequency: 1},
  ]), frequency: 6},
  {value: new EffectType('heal', 'Heal ?', [
    {value: {value: 1}, frequency: 9},
    {value: {value: 2}, frequency: 7},
    {value: {value: 3}, frequency: 5},
    {value: {value: 4}, frequency: 3},
    {value: {value: 5}, frequency: 1},
  ]), frequency: 4},
]

export const TARGET_TYPES = [
  {value: new TargetType('everyone', 'Everyone'), frequency: 1},
  {value: new TargetType('self', 'Self'), frequency: 5},
  {value: new TargetType('random', 'Random Player'), frequency: 5},
  {value: new TargetType('adjacent', 'Adjacent Players'), frequency: 3},
]

export const randomizer = (array) => {
  const array2 = []
  for (const e of array) { // OPTIMIZE: Random selection by frequency
    for (let i = 0; i < e.frequency; i++) {
      array2.push({...e.value, frequency: e.frequency})
    }
  }
  const idx = Math.floor(Math.random() * array2.length)
  const selected = array2[idx]
  const rarity = array2.length / selected.frequency
  const attribute = {...selected, rarity: rarity}

  // Randomize variable
  if (attribute.variableValues) {
    const variable = randomizer(attribute.variableValues)
    attribute.variableValue = variable.value
    attribute.rarity *= variable.rarity
    attribute.displayName = attribute.displayName.replace('?', variable.value)
  }

  return attribute
}

export const randomCard = () => {
  const trigger = randomizer(TRIGGER_TYPES)
  const effect = randomizer(EFFECT_TYPES)
  const target = randomizer(TARGET_TYPES)
  const rarity = trigger.rarity * effect.rarity * target.rarity
  return new Card(trigger, effect, target, rarity)
}
