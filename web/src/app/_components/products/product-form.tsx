"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import { Product, CreateProduct, UpdateProduct } from "@/data/products/products.types"

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must have a maximum of 200 characters"),
  description: z.string().max(1000, "Description must have a maximum of 1000 characters").optional(),
  price: z.string().min(1, "Price is required").refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Price must be a positive number"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
})

// Function to generate slug based on name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .replace(/^-|-$/g, '') // Remove hyphens at beginning and end
}

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  product?: Product
  onSubmit: (data: CreateProduct | UpdateProduct) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price?.toString() || "",
      imageUrl: product?.imageUrl || "",
      categoryIds: product?.categoryIds || [],
    },
  })

  const handleSubmit = (data: ProductFormValues) => {
    const submitData = {
      ...data,
      price: parseFloat(data.price),
      imageUrl: data.imageUrl || undefined,
      slug: generateSlug(data.name),
    }
    
    if (product) {
      // Update mode - omit required fields for partial update
      const updateData: UpdateProduct = {
        name: submitData.name,
        price: submitData.price,
        imageUrl: submitData.imageUrl,
        description: submitData.description,
      }
      onSubmit(updateData)
    } else {
      // Create mode - include all required fields
      const createData: CreateProduct = {
        name: submitData.name,
        slug: submitData.slug,
        price: submitData.price,
        categoryIds: submitData.categoryIds,
        description: submitData.description,
        imageUrl: submitData.imageUrl,
      }
      onSubmit(createData)
    }
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : product ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 