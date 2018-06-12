class Card {
  constructor(trigger, effect, target, rarity) {
    this.trigger = trigger
    this.effect = effect
    this.target = target
    this.rarity = rarity

    this.cooldown = 0
    this.number = null
    this.ownerIdx = null
  }
}
export default Card
