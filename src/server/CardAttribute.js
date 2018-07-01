// @flow

import RVal from './RVal'

class CardAttribute {
  id: string
  longName: string
  shortName: string
  variableValues: ?Array<RVal>

  variableValue: ?number

  constructor(id: string,
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
