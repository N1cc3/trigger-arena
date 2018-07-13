// @flow

export default class RVal {
  value: any
  frequency: number

  constructor(value: any, frequency: number) {
    this.value = value
    this.frequency = frequency
  }
}

export function randomizer(rVals: Array<RVal>): { selected: any, rarity: number } {
  let totalFreq = 0
  for (const rVal of rVals) {
    totalFreq += rVal.frequency
  }

  const i = Math.floor(Math.random() * totalFreq)
  let j = totalFreq
  let selected: ?RVal = null

  for (const rVal of rVals) {
    j -= rVal.frequency
    if (i >= j) {
      selected = rVal
      break
    }
  }

  if (selected == null) throw Error('Randomizer error.')

  const rarity = totalFreq / selected.frequency
  return {selected: selected.value, rarity: rarity}
}
