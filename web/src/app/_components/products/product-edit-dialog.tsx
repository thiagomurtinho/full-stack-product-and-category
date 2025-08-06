"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductEditForm } from "./product-edit-form"
import { UpdateProduct, ProductWithCategories } from "@/data/products/products.types"
import { Category } from "@/data/categories/categories.types"

interface ProductEditDialogProps {
  product: ProductWithCategories
  categories: Category[]
  onSubmit: (data: UpdateProduct) => Promise<void>
  onClose?: () => void
}

export function ProductEditDialog({ product, categories, onSubmit, onClose }: ProductEditDialogProps) {
  const [open, setOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: UpdateProduct) => {
    try {
      setIsLoading(true)
      await onSubmit(data)
      setOpen(false)
    } catch (error) {
      console.error("Error updating product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if not loading
    if (!isLoading) {
      setOpen(newOpen)
      if (!newOpen && onClose) {
        onClose()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make the necessary changes to the product.
          </DialogDescription>
        </DialogHeader>
        <ProductEditForm
          product={product}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
} 