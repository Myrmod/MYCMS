import type { SchemaOptions } from 'arangojs/collection'

// https://json-schema.org/understanding-json-schema/reference/object.html
export default {
  rule: {
    properties: {
      token: { type: 'string' },
    },
  },
  level: 'strict',
  message: 'The token does have not allowed content.',
} as SchemaOptions
