export default class RVal {
  constructor(value, frequency) {
    this.value = value
    this.frequency = frequency
  }
}

export const randomizer = (rVals) => {
  let totalFreq = 0
  for (const rVal of rVals) {
    totalFreq += rVal.frequency
  }
  const i = Math.floor(Math.random() * totalFreq)
  let j = totalFreq
  let selected = null
  for (const rVal of rVals) {
    j -= rVal.frequency
    if (i >= j) {
      selected = rVal
      break
    }
  }

  const rarity = totalFreq / selected.frequency
  const result = {selected: selected.value, rarity: rarity}

  return result
}
