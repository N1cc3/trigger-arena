// @flow

import type { Target } from '../Card'
import Player from '../Player'
import Game from '../Game'

class Everyone implements Target {
  type = 'everyone'
  getShortName = () => 'Everyone'
  getLongName = () => 'Everyone'
  value = null

  resolve = (game: Game, player: Player) => {
    return game.players
  }

  shouldDiscardCard = (game: Game) => false
}

export default Everyone
