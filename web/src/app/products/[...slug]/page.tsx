import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

import { productsApi } from '@/data/products/products.api'
import { ProductWithCategories } from '@/data/products/products.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ProductPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  
  // The last element is the product slug, the rest is the category path
  const productSlug = slug[slug.length - 1]
  const categoryPath = slug.slice(0, -1)
  const fullCategoryPath = categoryPath.join('/')

  try {
    const product = await productsApi.getBySlug(productSlug)

    // Validate that the category path matches one of the product's category paths
    // Allow both exact matches and partial matches (for shorter paths)
    const isValidPath = product.categoryPaths.some((path: string) => 
      path === fullCategoryPath || 
      fullCategoryPath.includes(path) || 
      path.includes(fullCategoryPath)
    )

    if (!isValidPath) {
      notFound()
    }

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price)
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm text-muted-foreground">
            {fullCategoryPath.split('/').join(' > ') || 'Produto'}
          </div>
        </div>

        {/* Product details card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
                <p className="text-3xl font-bold text-primary mt-2">
                  {formatPrice(product.price)}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver todos os produtos
                </Link>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category: any) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Product details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Informações do Produto</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono">{product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slug:</span>
                    <span className="font-mono">{product.slug}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Criado em:</span>
                    <span>{new Date(product.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Atualizado em:</span>
                    <span>{new Date(product.updatedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* Category paths */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Caminhos das Categorias</h3>
                <div className="space-y-1">
                  {product.categoryPaths.map((path: string, index: number) => (
                    <div key={index} className="text-sm">
                      <span className="text-muted-foreground">•</span>
                      <span className="ml-2 font-mono">{path}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }
} 