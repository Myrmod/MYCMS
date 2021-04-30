import type { SchemaOptions } from 'arangojs/collection'

export default {
  rule: {
    properties: {},
    additionalProperties: false,
  },
  level: 'moderate',
  message:
    "The document does not contain an array of numbers in attribute 'nums', or one of the numbers is bigger than 6.",
} as SchemaOptions
