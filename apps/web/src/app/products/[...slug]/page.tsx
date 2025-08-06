import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { productsApi } from "@/data/products/products.api"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  if (!slug || slug.length === 0) {
    notFound()
  }

  const productSlug = slug[slug.length - 1]
  const fullCategoryPath = slug.slice(0, -1).join('/')

  try {
    const product = await productsApi.getBySlug(productSlug)

    // Validate product data structure
    if (!product || typeof product !== 'object') {
      console.error('Invalid product data:', product)
      notFound()
    }

    // Validate if the product belongs to the category path
    const isValidPath = product.categoryPaths?.some((path: string) =>
      path === fullCategoryPath ||
      fullCategoryPath.includes(path) ||
      path.includes(fullCategoryPath)
    ) ?? false

    if (!isValidPath && fullCategoryPath) {
      notFound()
    }

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price)
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm text-muted-foreground">
            {fullCategoryPath ? `${fullCategoryPath.split('/').join(' > ')}` : "Produto"}
          </div>
        </div>

        {/* Product details card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {String(product.name || 'Unknown Product')}
                </CardTitle>
                <p className="text-3xl font-bold text-primary mt-2">
                  {formatPrice(product.price || 0)}
                </p>
              </div>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver todos os produtos
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {String(product.description)}
                </p>
              </div>
            )}

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(product.categories) && product.categories.length > 0 ? (
                  product.categories.map((category: any) => (
                    <Badge key={category.id} variant="secondary">
                      {String(category.name || 'Unknown Category')}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No categories available</span>
                )}
              </div>
            </div>

            {/* Product details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Informações do Produto</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono">{String(product.id || 'N/A')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slug:</span>
                    <span className="font-mono">{String(product.slug || 'N/A')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Criado em:</span>
                    <span>
                      {product.createdAt 
                        ? new Date(product.createdAt).toLocaleDateString('pt-BR')
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Atualizado em:</span>
                    <span>
                      {product.updatedAt 
                        ? new Date(product.updatedAt).toLocaleDateString('pt-BR')
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Category paths */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Caminhos das Categorias</h3>
                <div className="space-y-1">
                  {Array.isArray(product.categoryPaths) && product.categoryPaths.length > 0 ? (
                    product.categoryPaths.map((path: string, index: number) => (
                      <div key={index} className="text-sm">
                        <span className="text-muted-foreground">•</span>
                        <span className="ml-2 font-mono">{String(path)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <span>Nenhum caminho de categoria disponível</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error loading product:', error)
    notFound()
  }
}