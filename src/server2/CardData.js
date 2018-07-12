// @flow

import Card from './Card'
import RVal, { randomizer } from './RVal'
import Adjacent from './targets/Adjacent'
import Everyone from './targets/Everyone'
import Random from './targets/Random'
import Self from './targets/Self'
import DamageDealt from './triggers/DamageDealt'
import DamageTaken from './triggers/DamageTaken'
import HealingDone from './triggers/HealingDone'
import HealingTaken from './triggers/HealingTaken'
import Instant from './triggers/Instant'
import Periodic from './triggers/Periodic'
import Damage from './effects/Damage'
import Heal from './effects/Heal'

export const EFFECT_TYPES: Array<RVal> = [
  new RVal(new Damage(1), 9),
  new RVal(new Damage(2), 7),
  new RVal(new Damage(3), 5),
  new RVal(new Damage(4), 3),
  new RVal(new Damage(5), 1),
  new RVal(new Heal(1), 5),
  new RVal(new Heal(2), 3),
  new RVal(new Heal(3), 1),
]

export const TARGET_TYPES: Array<RVal> = [
  new RVal(new Adjacent(), 3),
  new RVal(new Everyone(), 1),
  new RVal(new Random(), 5),
  new RVal(new Self(), 5),
]

export const TRIGGER_TYPES: Array<RVal> = [
  new RVal(new DamageDealt(), 30),
  new RVal(new DamageTaken(), 30),
  new RVal(new HealingDone(), 30),
  new RVal(new HealingTaken(), 30),
  new RVal(new Instant(), 90),
  new RVal(new Periodic(1), 1),
  new RVal(new Periodic(2), 3),
  new RVal(new Periodic(3), 5),
  new RVal(new Periodic(4), 7),
  new RVal(new Periodic(5), 9),
]

export const randomCard: (number) => Card = (id) => {
  const trigger = randomizer(TRIGGER_TYPES)
  const effect = randomizer(EFFECT_TYPES)
  const target = randomizer(TARGET_TYPES)
  const rarity = trigger.rarity * effect.rarity * target.rarity
  return new Card(id, trigger.selected, effect.selected, target.selected, rarity)
}
