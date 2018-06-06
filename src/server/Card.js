class Card {
  constructor(trigger, effect, target, rarity) {
    this.trigger = trigger
    this.effect = effect
    this.target = target
    this.rarity = rarity

    this.number = null
    this.cooldown = 0
  }
}
export default Card
