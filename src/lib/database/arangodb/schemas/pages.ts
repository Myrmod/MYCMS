import type { SchemaOptions } from 'arangojs/collection'
import fs from 'fs'

const availableComponents = fs.readdirSync('src/components/builder/blocks')

if (availableComponents) {
  availableComponents.forEach(
    (component: string, index: string | number, array: { [x: string]: any }) => {
      array[index] = component.replace('.svelte', '')
    },
  )
}

// https://json-schema.org/understanding-json-schema/reference/object.html
export default {
  rule: {
    properties: {
      name: { type: 'string' },
      regions: {
        type: 'array',
        items: {
          // regions
          type: 'object',
          properties: {
            position: { type: 'string' },
            elements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    enum: availableComponents,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  level: 'strict',
  message: 'The page does have not allowed content.',
} as SchemaOptions
