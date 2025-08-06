"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UpdateProduct, ProductWithCategories } from "@/data/products/products.types"
import { Category } from "@/data/categories/categories.types"
import { CategoryTree } from "../categories/category-tree"

const productEditFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must have a maximum of 200 characters"),
  description: z.string().max(1000, "Description must have a maximum of 1000 characters").optional(),
  price: z.string().min(1, "Price is required").refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Price must be a positive number"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  categoryIds: z.array(z.string()),
})

type ProductEditFormValues = z.infer<typeof productEditFormSchema>

interface ProductEditFormProps {
  product: ProductWithCategories
  categories: Category[]
  onSubmit: (data: UpdateProduct) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ProductEditForm({ product, categories, onSubmit, onCancel, isLoading = false }: ProductEditFormProps) {
  const form = useForm<ProductEditFormValues>({
    resolver: zodResolver(productEditFormSchema),
    defaultValues: {
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      imageUrl: product.imageUrl || "",
      categoryIds: product.categoryIds || [],
    },
  })

  // Reset form when product changes
  useEffect(() => {
    form.reset({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      imageUrl: product.imageUrl || "",
      categoryIds: product.categoryIds || [],
    })
  }, [product])

  const handleSubmit = (data: ProductEditFormValues) => {
    const updateData: UpdateProduct = {
      name: data.name,
      price: parseFloat(data.price),
      imageUrl: data.imageUrl || undefined,
      description: data.description,
    }
    onSubmit(updateData)
  }

  const handleCategorySelectionChange = (selectedIds: string[]) => {
    form.setValue('categoryIds', selectedIds)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Product description (optional)" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input 
                  type="url" 
                  placeholder="https://example.com/image.jpg" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <div className="max-h-48 overflow-y-auto border rounded-md p-3">
                  <CategoryTree
                    categories={categories}
                    selectedIds={field.value}
                    onSelectionChange={handleCategorySelectionChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 