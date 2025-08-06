import { Suspense } from "react"
import { productsApi } from "@/data/products/products.api"
import { categoriesApi } from "@/data/categories/categories.api"
import { ProductsPage } from "./_components/products/products-page"

async function getProducts() {
  try {
    const result = await productsApi.getAll()
    return result.data
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

async function getCategories() {
  try {
    return await categoriesApi.getAll()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function HomePage() {
  let products = []
  let categories = []

  try {
    [products, categories] = await Promise.all([
      getProducts(),
      getCategories()
    ])
  } catch (error) {
    console.error("Error fetching initial data:", error)
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ProductsPage initialProducts={products} categories={categories} />
    </Suspense>
  )
}

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'
