import Card from '../server/Card'

class ClientCard extends Card {
  onUse: () => {}
  onReady: () => {}
  triggered: false

  constructor(...args) {
    super(...args)
    this.onUse = () => {
    }
    this.onReady = () => {
    }
    this.triggered = false
  }
}

export default ClientCard
