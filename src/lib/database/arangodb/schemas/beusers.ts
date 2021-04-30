import type { SchemaOptions } from 'arangojs/collection'

// https://json-schema.org/understanding-json-schema/reference/object.html
export default {
  rule: {
    properties: {
      name: { type: 'string' },
      password: { type: 'string' },
      role: {
        type: 'string',
        enum: ['admin', 'moderator'],
      },
    },
  },
  level: 'strict',
  message: 'The user does have not allowed content.',
} as SchemaOptions
