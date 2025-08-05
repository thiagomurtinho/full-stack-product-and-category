import swaggerJSDoc from 'swagger-jsdoc'
import { Options } from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Full Stack Product and Category API',
    version: '1.0.0',
    description: `
RESTful API for products and categories management with Functional Core / Imperative Shell architecture.

## Features

### Categories
- Complete CRUD operations
- Category hierarchy (tree structure)
- Path resolution (\`/electronics/computers/laptops\`)
- Search and filters
- Pagination

### Products
- Complete CRUD operations
- Multiple categories per product
- Fuzzy match search
- Filters by category, price
- Sorting
- Pagination
- Path resolution (\`/electronics/computers/laptops/macbook-pro-16-inch\`)

## Architecture
- **Functional Core**: Pure and testable business logic
- **Imperative Shell**: HTTP interface and infrastructure
- **TypeScript**: Type safety across all layers
- **Zod**: Robust input and output validation
- **Prisma**: Modern ORM with SQLite
    `,
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    },
    {
      url: 'https://api.example.com',
      description: 'Production server'
    }
  ],
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message'
          },
          details: {
            type: 'object',
            description: 'Additional error details'
          }
        },
        required: ['error']
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z'
          },
          architecture: {
            type: 'string',
            example: 'Functional Core / Imperative Shell'
          },
          version: {
            type: 'string',
            example: '1.0.0'
          }
        },
        required: ['status', 'timestamp', 'architecture', 'version']
      },
      Category: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
          },
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            example: 'Electronics'
          },
          slug: {
            type: 'string',
            pattern: '^[a-z0-9-]+$',
            example: 'electronics'
          },
          parentId: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            example: null
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z'
          }
        },
        required: ['id', 'name', 'slug', 'parentId', 'createdAt', 'updatedAt']
      },
      CreateCategory: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            example: 'Electronics'
          },
          slug: {
            type: 'string',
            pattern: '^[a-z0-9-]+$',
            example: 'electronics'
          },
          parentId: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            example: null
          }
        },
        required: ['name', 'slug']
      },
      UpdateCategory: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            example: 'Electronics'
          },
          slug: {
            type: 'string',
            pattern: '^[a-z0-9-]+$',
            example: 'electronics'
          },
          parentId: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            example: null
          }
        }
      },
      CategoryPath: {
        type: 'object',
        properties: {
          ids: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid'
            },
            example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479']
          },
          names: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['Electronics']
          },
          slugs: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['electronics']
          },
          fullPath: {
            type: 'string',
            example: '/electronics'
          }
        },
        required: ['ids', 'names', 'slugs', 'fullPath']
      },
      CategoryWithPath: {
        allOf: [
          { $ref: '#/components/schemas/Category' },
          {
            type: 'object',
            properties: {
              path: {
                $ref: '#/components/schemas/CategoryPath'
              },
              children: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Category'
                }
              }
            }
          }
        ]
      },
      Product: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
          },
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            example: 'MacBook Pro 16-inch'
          },
          slug: {
            type: 'string',
            pattern: '^[a-z0-9-]+$',
            example: 'macbook-pro-16-inch'
          },
          description: {
            type: 'string',
            maxLength: 1000,
            nullable: true,
            example: 'Powerful laptop for professionals'
          },
          price: {
            type: 'number',
            minimum: 0,
            example: 2499.99
          },
          imageUrl: {
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://example.com/images/macbook.jpg'
          },
          categoryIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid'
            },
            example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479']
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z'
          }
        },
        required: ['id', 'name', 'slug', 'price', 'categoryIds', 'createdAt', 'updatedAt']
      },
      CreateProduct: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            example: 'MacBook Pro 16-inch'
          },
          slug: {
            type: 'string',
            pattern: '^[a-z0-9-]+$',
            example: 'macbook-pro-16-inch'
          },
          description: {
            type: 'string',
            maxLength: 1000,
            example: 'Powerful laptop for professionals'
          },
          price: {
            type: 'number',
            minimum: 0,
            example: 2499.99
          },
          imageUrl: {
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://example.com/images/macbook.jpg'
          },
          categoryIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid'
            },
            example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479']
          }
        },
        required: ['name', 'slug', 'price', 'categoryIds']
      },
      UpdateProduct: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            example: 'MacBook Pro 16-inch'
          },
          slug: {
            type: 'string',
            pattern: '^[a-z0-9-]+$',
            example: 'macbook-pro-16-inch'
          },
          description: {
            type: 'string',
            maxLength: 1000,
            example: 'Powerful laptop for professionals'
          },
          price: {
            type: 'number',
            minimum: 0,
            example: 2499.99
          },
          imageUrl: {
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://example.com/images/macbook.jpg'
          },
          categoryIds: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid'
            },
            example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479']
          }
        }
      },
      ProductCategory: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid'
          },
          name: {
            type: 'string'
          },
          slug: {
            type: 'string'
          },
          path: {
            $ref: '#/components/schemas/CategoryPath'
          }
        },
        required: ['id', 'name', 'slug']
      },
      ProductWithCategories: {
        allOf: [
          { $ref: '#/components/schemas/Product' },
          {
            type: 'object',
            properties: {
              categories: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/ProductCategory'
                }
              },
              categoryPaths: {
                type: 'array',
                items: {
                  type: 'string'
                },
                example: ['/electronics/computers/laptops']
              }
            }
          }
        ]
      }
    }
  }
}

const options: Options = {
  definition: swaggerDefinition,
  apis: [
    'src/routes/*.ts',
    'src/handlers/*.ts',
    'src/domain/**/*.ts'
  ]
}

export const specs = swaggerJSDoc(options)
export { swaggerDefinition }
