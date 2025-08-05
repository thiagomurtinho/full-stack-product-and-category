import { Suspense } from "react"
import { productsApi } from "@/data/products/products.api"
import { categoriesApi } from "@/data/categories/categories.api"

// Server Component to test API communication using data layer
async function TestApiConnection() {
  try {
    // Test 1: Fetch products using productsApi with pagination
    const productsResult = await productsApi.getAll({ limit: 10, offset: 0 })
    
    // Test 2: Fetch categories using categoriesApi
    const categories = await categoriesApi.getAll()
    
    // Test 3: Fetch counters
    const productsCount = await productsApi.getCount()
    const categoriesCount = await categoriesApi.count()
    
    return {
      success: true,
      products: productsResult.data.length,
      categories: categories.length,
      productsCount: productsCount.count,
      categoriesCount: categoriesCount.count,
      productsData: productsResult.data.slice(0, 3), // First 3 products for visualization
      categoriesData: categories.slice(0, 3), // First 3 categories for visualization
      pagination: productsResult.pagination
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Component to display test results
function TestResults({ data }: { data: any }) {
  if (!data.success) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800 mb-2">❌ API Connection Failed</h2>
        <p className="text-red-600">{data.error}</p>
        <p className="text-sm text-red-500 mt-2">
          Make sure the backend is running on http://localhost:5005
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
      <h2 className="text-lg font-semibold text-green-800 mb-4">✅ API Connection Successful</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products Test */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium text-gray-900 mb-2">📦 Products Test</h3>
          <p className="text-sm text-gray-600 mb-3">
            Found {data.products} products in current page (Total: {data.productsCount})
          </p>
          
          {/* Pagination Info */}
          {data.pagination && (
            <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
              <p><strong>Pagination:</strong> Page {data.pagination.currentPage} of {data.pagination.totalPages}</p>
              <p><strong>Items per page:</strong> {data.pagination.limit}</p>
              <p><strong>Total items:</strong> {data.pagination.total}</p>
            </div>
          )}
          
          {data.productsData.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500">Sample Products:</p>
              {data.productsData.map((product: any) => (
                <div key={product.id} className="text-xs bg-gray-50 p-2 rounded">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-gray-500 ml-2">${product.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories Test */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium text-gray-900 mb-2">🏷️ Categories Test</h3>
          <p className="text-sm text-gray-600 mb-3">
            Found {data.categories} categories in database (Total: {data.categoriesCount})
          </p>
          
          {data.categoriesData.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500">Sample Categories:</p>
              {data.categoriesData.map((category: any) => (
                <div key={category.id} className="text-xs bg-gray-50 p-2 rounded">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-gray-500 ml-2">({category.slug})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Status:</strong> All API endpoints are responding correctly with server-side pagination
        </p>
      </div>
    </div>
  )
}

export default async function HomePage() {
    const testData = await TestApiConnection()
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Backend API Connection Test
          </h1>
          <p className="text-gray-600">
            Testing communication with the backend API using Server Components
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Testing API connection...</p>
            </div>
          </div>
        }>
          <TestResults data={testData} />
        </Suspense>


        {/* <Suspense fallback={
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Testing API connection...</p>
            </div>
          </div>
        }>
          <TestResults data={testData} />
        </Suspense> */}
      </div>
    </div>
  )
}

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'
