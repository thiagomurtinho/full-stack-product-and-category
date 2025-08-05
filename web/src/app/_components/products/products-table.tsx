"use client"

import { useMemo, useState } from "react"
import { productsApi } from "@/data/products/products.api"
import { Product, CreateProduct, UpdateProduct, ProductWithCategories } from "@/data/products/products.types"
import { DataTable } from "./data-table"
import { createColumns } from "./columns"
import { ProductDialog } from "./product-dialog"
import { useServerPagination } from "./use-server-pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ProductsTableProps {
  initialProducts: Product[]
  selectedCategoryIds?: string[]
  isCategoryFilterPending?: boolean
}

export function ProductsTable({ initialProducts, selectedCategoryIds = [], isCategoryFilterPending }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Use server-side pagination hook
  const {
    products,
    pagination,
    isLoading: isPaginationLoading,
    error,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    total,
    setPage,
    setSearch,
    refresh
  } = useServerPagination({
    initialLimit: 10,
    selectedCategoryIds
  })

  const handleCreateProduct = async (data: CreateProduct | UpdateProduct) => {
    try {
      setIsLoading(true)
      const newProduct = await productsApi.create(data as CreateProduct)
      // Refresh the list after creating
      refresh()
    } catch (error) {
      console.error("Error creating product:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProduct = async (data: UpdateProduct) => {
    if (!editingProduct) return

    try {
      setIsLoading(true)
      await productsApi.update(editingProduct.id, data)
      setEditingProduct(null)
      // Refresh the list after updating
      refresh()
    } catch (error) {
      console.error("Error updating product:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return

    try {
      setIsLoading(true)
      await productsApi.delete(deletingProduct.id)
      setDeletingProduct(null)
      // Refresh the list after deleting
      refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleDelete = (product: Product) => {
    setDeletingProduct(product)
  }

  const handleView = (product: ProductWithCategories) => {
    // Build the URL based on the first category path
    const categoryPath = product.categoryPaths[0] || 'products'
    const url = `/products/${categoryPath}/${product.slug}`
    window.open(url, '_blank')
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onView: handleView,
  })

  // Show error if there's one
  if (error) {
    return (
      <div className="space-y-4 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Product List</h2>
          <ProductDialog onSubmit={handleCreateProduct} />
        </div>
        <div className="rounded-md border p-4 bg-red-50">
          <p className="text-red-600">Error loading products: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product List</h2>
        <ProductDialog onSubmit={handleCreateProduct} />
      </div>

      <div className="w-full">
        <DataTable 
          columns={columns} 
          data={products}
          pageCount={totalPages}
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrev={hasPrev}
          total={total}
          onPageChange={setPage}
          onSearchChange={setSearch}
          isLoading={isPaginationLoading || isLoading}
          isCategoryFilterPending={isCategoryFilterPending}
        />
      </div>

      {/* Dialog to edit product */}
      {editingProduct && (
        <ProductDialog
          product={editingProduct}
          onSubmit={handleUpdateProduct}
        />
      )}

      {/* Confirmation dialog to delete */}
      <Dialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product &quot;{deletingProduct?.name}&quot;? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingProduct(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProduct}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 