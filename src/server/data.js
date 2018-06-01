import CardAttribute from './CardAttribute'
import Card from './Card'
import RVal from './RVal'
import { randomizer } from './RVal'

class TriggerType extends CardAttribute {}
class EffectType extends CardAttribute {}
class TargetType extends CardAttribute {}

export const TRIGGER_TYPES = [
  new RVal(new TriggerType('instant', 'Instant'), 8),
  new RVal(new TriggerType('everyTurn', 'On Every ? Turn', [
    new RVal(1, 1),
    new RVal(2, 3),
    new RVal(3, 5),
    new RVal(4, 7),
    new RVal(5, 9),
  ]), 2),
  new RVal(new TriggerType('dealsDmg', 'Deals Damage To Other'), 3),
  new RVal(new TriggerType('takesDmg', 'Takes Damage'), 3),
  new RVal(new TriggerType('heals', 'Heals'), 3),
  new RVal(new TriggerType('isHealed', 'Is Healed'), 3),
]

export const EFFECT_TYPES = [
  new RVal(new EffectType('damage', 'Deal ? damage', [
    new RVal(1, 9),
    new RVal(2, 7),
    new RVal(3, 5),
    new RVal(4, 3),
    new RVal(5, 1),
  ]), 6),
  new RVal(new EffectType('heal', 'Heal ?', [
    new RVal(1, 9),
    new RVal(2, 7),
    new RVal(3, 5),
    new RVal(4, 3),
    new RVal(5, 1),
  ]), 4),
]

export const TARGET_TYPES = [
  new RVal(new TargetType('everyone', 'Everyone'), 1),
  new RVal(new TargetType('self', 'Self'), 5),
  new RVal(new TargetType('random', 'Random Player'), 5),
  new RVal(new TargetType('adjacent', 'Adjacent Players'), 3),
]

const initVariableValues = (rVal) => {
  if (rVal.selected.variableValues) {
    const variable = randomizer(rVal.selected.variableValues)
    rVal.selected.variableValue = variable.selected
    rVal.rarity *= variable.rarity
    rVal.selected.displayName = rVal.selected.displayName.replace('?', variable.selected)
  }
}

export const randomCard = () => {
  const trigger = randomizer(TRIGGER_TYPES)
  initVariableValues(trigger)
  const effect = randomizer(EFFECT_TYPES)
  initVariableValues(effect)
  const target = randomizer(TARGET_TYPES)
  initVariableValues(target)
  const rarity = trigger.rarity * effect.rarity * target.rarity
  return new Card(trigger.selected, effect.selected, target.selected, rarity)
}
