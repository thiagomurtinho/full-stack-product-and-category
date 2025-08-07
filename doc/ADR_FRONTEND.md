# ADR-002: Frontend Architecture - Next.js 15 with Domain-Driven Design

## 📋 Index

1. [Status](#status)
2. [Context](#context)
3. [Decision](#decision)
4. [Consequences](#consequences)
5. [Alternatives Considered](#alternatives-considered)
6. [Implementation](#implementation)
7. [Success Metrics](#success-metrics)

---

## ✅ Status

**Accepted** - Implemented and in production

**Date**: December 2024  
**Responsible**: Senior Software Engineer  
**Review**: Annual

---

## 🎯 Context

### Problem
We needed to develop a modern interface for product and category management that:

- Offered excellent user experience
- Was responsive and accessible
- Maintained optimized performance
- Followed modern development standards
- Integrated perfectly with the backend API
- Facilitated maintenance and evolution

### Constraints
- Small team (1-2 developers)
- Need for rapid development
- Requirement for high code quality
- Need for SEO and performance
- Integration with REST/JSON API

### Stakeholders
- Frontend developers
- Backend developers
- Product Manager
- UX/UI Designers
- End users

---

## 🏗️ Decision

### Chosen Architecture: Next.js 15 with Domain-Driven Design

#### Layer Structure

```
src/
├── app/              # App Router (Next.js 15)
│   ├── _components/  # Application-specific components
│   └── globals.css   # Global styles
├── components/       # Reusable components (UI)
│   └── ui/          # Base components (Shadcn UI)
├── data/            # Data layer (DDD)
│   ├── products/    # Product domain
│   ├── categories/  # Category domain
│   └── shared/      # Shared utilities
├── lib/             # Utilities and hooks
│   └── hooks/       # Custom hooks
└── types/           # TypeScript types
```

#### Applied Principles

1. **Domain-Driven Design**: Clear separation by domains
2. **Component-Based Architecture**: Reusable components
3. **Data Layer Pattern**: Separate data layer
4. **Contract Pattern**: Shared types and validation
5. **Custom Hooks**: Reusable logic

---

## ⚡ Consequences

### ✅ Advantages

#### Performance
- **Server-Side Rendering**: Better SEO and initial performance
- **Static Generation**: Static pages when possible
- **Code Splitting**: Optimized loading
- **Image Optimization**: Automatic image optimization

#### Developer Experience
- **Type Safety**: TypeScript throughout the application
- **Hot Reload**: Fast development
- **Built-in Optimizations**: Next.js optimizes automatically
- **Modern Tooling**: ESLint, Prettier, Jest integrated

#### User Experience
- **Responsive Design**: Works on all devices
- **Accessibility**: Accessible components (Shadcn UI)
- **Modern UI**: Clean and intuitive interface
- **Fast Interactions**: Fluid and responsive interactions

#### Maintainability
- **Clear Structure**: Clear and organized structure
- **Reusable Components**: Modular components
- **Testable Code**: Easily testable code
- **Scalable Architecture**: Easy to extend

### ⚠️ Disadvantages

#### Complexity
- **Learning Curve**: Next.js 15 has new features
- **Bundle Size**: Framework may add weight
- **Configuration**: Complex initial configuration
- **Debugging**: Debugging may be more complex

#### Vendor Lock-in
- **Next.js Specific**: Some features are Next.js specific
- **Migration Cost**: Migration to another framework would be costly
- **Version Updates**: Updates may break code

---

## 🔄 Alternatives Considered

### 1. Create React App (CRA)
```
src/
├── components/
├── pages/
└── utils/
```

**❌ Rejected**: No SSR, inferior performance, fewer optimizations

### 2. Vite + React
```
src/
├── components/
├── pages/
└── utils/
```

**❌ Rejected**: No native SSR, manual configuration required

### 3. Remix
```
app/
├── routes/
├── components/
└── utils/
```

**❌ Rejected**: Less mature, smaller ecosystem

### 4. SvelteKit
```
src/
├── routes/
├── components/
└── lib/
```

**❌ Rejected**: Different stack, learning curve

---

## 🛠️ Implementation

### Domain Structure

#### Products Domain
```typescript
// data/products/products.contract.ts
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  categoryIds: z.array(z.string().uuid()),
  createdAt: z.date(),
  updatedAt: z.date()
})

// data/products/products.api.ts
export class ProductsAPI {
  private baseUrl = '/api/products'
  
  async getAll(params: GetProductsParams): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}?${new URLSearchParams(params)}`)
    return this.handleResponse(response)
  }
  
  async getById(id: string): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/${id}`)
    return this.handleResponse(response)
  }
}
```

#### Categories Domain
```typescript
// data/categories/categories.api.ts
export class CategoriesAPI {
  private baseUrl = '/api/categories'
  
  async getAll(): Promise<Category[]> {
    const response = await fetch(this.baseUrl)
    return this.handleResponse(response)
  }
  
  async getPathBySlug(slug: string): Promise<CategoryWithPath> {
    const response = await fetch(`${this.baseUrl}/path/${slug}`)
    return this.handleResponse(response)
  }
}
```

### Components

#### UI Components (Shadcn UI)
```typescript
// components/ui/button.tsx
// Shadcn UI is built on top of Radix UI primitives
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

#### Application Components
```typescript
// app/_components/products/products-table.tsx
export function ProductsTable({ products }: { products: Product[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div>{row.getValue('name')}</div>
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
          const price = parseFloat(row.getValue('price'))
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(price)
          return <div>{formatted}</div>
        }
      }
    ],
    []
  )
  
  return (
    <DataTable
      columns={columns}
      data={products}
      sorting={sorting}
      onSortingChange={setSorting}
      columnFilters={columnFilters}
      onColumnFiltersChange={setColumnFilters}
    />
  )
}
```

### Custom Hooks

```typescript
// lib/hooks/use-debounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// lib/hooks/use-debounced-category-filter.ts
export function useDebouncedCategoryFilter() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const debouncedCategories = useDebounce(selectedCategories, 300)
  
  return {
    selectedCategories,
    setSelectedCategories,
    debouncedCategories
  }
}
```

---

## 📊 Success Metrics

### Performance
- **Lighthouse Score**: > 90 ✅
- **First Contentful Paint**: < 1.5s ✅
- **Largest Contentful Paint**: < 2.5s ✅
- **Cumulative Layout Shift**: < 0.1 ✅

### Developer Experience
- **Build Time**: < 30s ✅
- **Hot Reload**: < 1s ✅
- **Type Safety**: 100% ✅
- **Test Coverage**: > 80% ✅

### User Experience
- **Responsive Design**: Works on all devices ✅
- **Accessibility**: WCAG 2.1 AA compliance ✅
- **Loading States**: Adequate visual feedback ✅
- **Error Handling**: Robust error handling ✅

### Code Quality
- **Bundle Size**: < 500KB ✅
- **Code Splitting**: Implemented ✅
- **Tree Shaking**: Working ✅
- **Minification**: Optimized ✅

---

## 🔄 Review and Evolution

### Review Criteria
- **Annual**: Complete architecture review
- **Quarterly**: Performance evaluation
- **Monthly**: Quality metrics review

### Change Triggers
- **Performance**: If Lighthouse Score < 80
- **Bundle Size**: If > 1MB
- **Build Time**: If > 60s
- **User Feedback**: If UX score < 4.0

### Planned Evolution
- **Phase 2**: PWA implementation
- **Phase 3**: Advanced performance optimizations
- **Phase 4**: Migration to React Server Components
- **Phase 5**: Streaming SSR implementation

---

## 📚 References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

*ADR created by: Thiago Murtinho*  
*Versão: 1.0*  
*Data: August 2025* 