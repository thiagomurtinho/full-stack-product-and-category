"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Product, ProductWithCategories } from "@/data/products/products.types"

interface ColumnsProps {
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onView: (product: ProductWithCategories) => void
}

export const createColumns = ({ onEdit, onDelete, onView }: ColumnsProps): ColumnDef<ProductWithCategories>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const product = row.original as ProductWithCategories
      // Use the most specific (longest) category path as the URL path
      const categoryPath = product.categoryPaths
        .sort((a, b) => b.length - a.length)[0] || 'products'
      const url = `/products/${categoryPath}/${product.slug}`
      
      return (
        <button
          onClick={() => window.open(url, '_blank')}
          className="text-left hover:underline hover:text-blue-600 cursor-pointer font-medium transition-colors"
          title={`View details for ${product.name}`}
        >
          {product.name}
        </button>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-[200px] truncate">
          {description || "No description"}
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "categoryIds",
    header: "Categories",
    cell: ({ row }) => {
      const categoryIds = row.getValue("categoryIds") as string[]
      return (
        <div className="text-sm text-muted-foreground">
          {categoryIds.length > 0 ? `${categoryIds.length} category(ies)` : "No categories"}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(product)}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            title="View details"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
            title="Edit product"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit product</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product)}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            title="Delete product"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete product</span>
          </Button>
        </div>
      )
    },
  },
] 