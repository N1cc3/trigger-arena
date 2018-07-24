// @flow

import type { Target } from '../Card'
import Player from '../Player'
import Game from '../Game'

class Self implements Target {
  type = 'self'
  getShortName = () => 'Self'
  getLongName = () => 'Self'
  value = null

  resolve = (game: Game, player: Player) => {
    return [player]
  }

  shouldDiscardCard = (game: Game) => false
}

export default Self
