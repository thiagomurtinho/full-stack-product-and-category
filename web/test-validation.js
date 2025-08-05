// Teste simples para validar o schema das categorias
const { z } = require('zod')

// Schema corrigido
const baseEntitySchema = z.object({
  id: z.uuid(),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
})

const slugSchema = z.string().min(1).max(200).regex(/^[a-z0-9-]+$/)

const categorySchema = baseEntitySchema.extend({
  name: z.string().min(1).max(100),
  slug: slugSchema,
  parentId: z.uuid().nullable(),
})

// Dados de exemplo da API
const sampleCategory = {
  "id": "f145aba6-d563-493e-8e0e-2b9bb4f9f646",
  "name": "Electronics",
  "slug": "electronics",
  "parentId": null,
  "createdAt": "2025-08-05T02:11:07.187Z",
  "updatedAt": "2025-08-05T02:11:07.187Z"
}

try {
  const result = categorySchema.parse(sampleCategory)
  console.log('✅ Validação bem-sucedida!')
  console.log('Resultado:', {
    id: result.id,
    name: result.name,
    slug: result.slug,
    parentId: result.parentId,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt
  })
} catch (error) {
  console.log('❌ Erro de validação:')
  console.log(error.errors)
} 