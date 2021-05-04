import type { SchemaOptions } from 'arangojs/collection'

export default {
  rule: {
    properties: {
      url: { type: 'string' },
    },
  },
  level: 'strict',
  message: 'The token does have not allowed content.',
} as SchemaOptions