import CardAttribute from './CardAttribute'

class TriggerType extends CardAttribute {}
class EventType extends CardAttribute {}
class TargetType extends CardAttribute {}

export const TRIGGER_TYPES = [
  new TriggerType('instant', 'Instant'),
  new TriggerType('onTurn', 'On Every X Turn'),
  new TriggerType('dealsDmg', 'Deals Damage'),
  new TriggerType('takesDmg', 'Takes Damage'),
  new TriggerType('heals', 'Heals'),
  new TriggerType('isHealed', 'Is Healed'),
]

export const EVENT_TYPES = [
  new EventType('damage', 'Deal X damage'),
  new EventType('heal', 'Heal X'),
]

export const TARGET_TYPES = [
  new TargetType('everyone', 'Everyone'),
  new TargetType('self', 'Self'),
  new TargetType('random', 'Random Player'),
  new TargetType('adjacent', 'Adjacent Players'),
]
