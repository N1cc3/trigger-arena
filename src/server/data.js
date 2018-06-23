import CardAttribute from './CardAttribute'
import Card from './Card'
import RVal from './RVal'
import { randomizer } from './RVal'

class TriggerType extends CardAttribute {}
class EffectType extends CardAttribute {}
class TargetType extends CardAttribute {}

export const TRIGGER_TYPES = [
  new RVal(new TriggerType('instant', 'Instant', 'Instant'), 12),
  new RVal(new TriggerType('periodic', 'On Every ? Turn', '? turn', [
    new RVal(1, 1),
    new RVal(2, 3),
    new RVal(3, 5),
    new RVal(4, 7),
    new RVal(5, 9),
  ]), 2),
  new RVal(new TriggerType('dealsDmg', 'Deals Damage To Other', 'Dmg other'), 3),
  new RVal(new TriggerType('takesDmg', 'Takes Damage', 'Take dmg'), 3),
  new RVal(new TriggerType('heals', 'Heals Other', 'Heal other'), 3),
  new RVal(new TriggerType('isHealed', 'Is Healed', 'Healed'), 3),
]

export const EFFECT_TYPES = [
  new RVal(new EffectType('damage', 'Deal ? damage', '? dmg', [
    new RVal(1, 9),
    new RVal(2, 7),
    new RVal(3, 5),
    new RVal(4, 3),
    new RVal(5, 1),
  ]), 6),
  new RVal(new EffectType('heal', 'Heal ?', 'Heal ?', [
    new RVal(1, 5),
    new RVal(2, 3),
    new RVal(3, 1),
  ]), 4),
]

export const TARGET_TYPES = [
  new RVal(new TargetType('everyone', 'Everyone', 'All'), 1),
  new RVal(new TargetType('self', 'Self', 'Self'), 5),
  new RVal(new TargetType('random', 'Random Player', 'Random'), 5),
  new RVal(new TargetType('adjacent', 'Adjacent Players', 'Adjacent'), 3),
]

const initVariableValues = (rVal) => {
  if (rVal.selected.variableValues) {
    const variable = randomizer(rVal.selected.variableValues)
    rVal.selected.variableValue = variable.selected
    rVal.rarity *= variable.rarity
    rVal.selected.longName = rVal.selected.longName.replace('?', variable.selected)
    rVal.selected.shortName = rVal.selected.shortName.replace('?', variable.selected)
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
