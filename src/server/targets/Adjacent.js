// @flow

import type { Target } from '../Card'
import Player from '../Player'
import Game, { mod } from '../Game'

class Adjacent implements Target {
  type = 'adjacent'
  getShortName = () => 'Adjacent'
  getLongName = () => 'Adjacent'
  value = null

  resolve = (game: Game, player: Player) => {
    const playerIdx = game.players.indexOf(player)
    let targetIdx1 = mod(playerIdx + 1, game.players.length)
    while (game.players[targetIdx1].isDead()) {
      targetIdx1 = mod(targetIdx1 + 1, game.players.length)
    }
    let targetIdx2 = mod(playerIdx - 1, game.players.length)
    while (game.players[targetIdx2].isDead()) {
      targetIdx2 = mod(targetIdx2 - 1, game.players.length)
    }
    const targets = []
    if (playerIdx !== targetIdx1) targets.push(game.players[targetIdx1])
    if (playerIdx !== targetIdx2 && targetIdx1 !== targetIdx2) targets.push(game.players[targetIdx2])
    return targets
  }

  shouldDiscardCard = (game: Game) => false
}

export default Adjacent
