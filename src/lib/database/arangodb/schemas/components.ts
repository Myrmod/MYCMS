import type { SchemaOptions } from 'arangojs/collection'
import fs from 'fs'

const availablePartials = fs.readdirSync('src/components/builder/blocks')

if (availablePartials) {
  availablePartials.forEach(
    (partial: string, index: string | number, array: { [x: string]: any }) => {
      array[index] = partial.replace('.svelte', '')
    },
  )
}

// https://json-schema.org/understanding-json-schema/reference/object.html
export default {
  rule: {
    properties: {
      name: { type: 'string' },
      partials: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              enum: availablePartials,
            },
          },
        },
      },
    },
  },
  level: 'strict',
  message: 'The component does have not allowed content.',
} as SchemaOptions
