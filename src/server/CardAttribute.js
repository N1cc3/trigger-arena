// @flow

import RVal from './RVal'

class CardAttribute {
  id: number
  longName: string
  shortName: string
  variableValues: ?Array<RVal>

  constructor(id: number,
              longName: string,
              shortName: string,
              variableValues: ?Array<RVal>) {
    this.id = id
    this.longName = longName
    this.shortName = shortName
    this.variableValues = variableValues
  }
}
export default CardAttribute
