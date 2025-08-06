"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProductForm } from "./product-form"
import { Product, CreateProduct, UpdateProduct } from "@/data/products/products.types"

interface ProductDialogProps {
  product?: Product
  onSubmit: (data: CreateProduct | UpdateProduct) => Promise<void>
  trigger?: React.ReactNode
}

export function ProductDialog({ product, onSubmit, trigger }: ProductDialogProps) {
  const [open, setOpen] = useState(!!product)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: CreateProduct | UpdateProduct) => {
    try {
      setIsLoading(true)
      await onSubmit(data)
      setOpen(false)
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {<>{trigger}</> || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Create New Product"}
          </DialogTitle>
                      <DialogDescription>
              {product 
                ? "Make the necessary changes to the product."
                : "Fill in the information for the new product."
              }
            </DialogDescription>
        </DialogHeader>
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
} 