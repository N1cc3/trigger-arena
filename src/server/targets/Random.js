// @flow

import type { Target } from '../Card'
import Player from '../Player'
import Game from '../Game'

class Random implements Target {
  type = 'random'
  getShortName = () => 'Random'
  getLongName = () => 'Random'
  value = null

  resolve = (game: Game, player: Player) => {
    return [game.players[Math.floor(Math.random() * game.players.length)]]
  }

  shouldDiscardCard = (game: Game) => false
}

export default Random
