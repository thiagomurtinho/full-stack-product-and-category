# ADR-002: Arquitetura Frontend - Next.js 15 com Domain-Driven Design

## 📋 Índice

1. [Status](#status)
2. [Contexto](#contexto)
3. [Decisão](#decisão)
4. [Consequências](#consequências)
5. [Alternativas Consideradas](#alternativas-consideradas)
6. [Implementação](#implementação)
7. [Métricas de Sucesso](#métricas-de-sucesso)

---

## ✅ Status

**Aceito** - Implementado e em produção

**Data**: Dezembro 2024  
**Responsável**: Software Engineer Senior  
**Revisão**: Anual

---

## 🎯 Contexto

### Problema
Precisávamos desenvolver uma interface moderna para gestão de produtos e categorias que:

- Oferecesse excelente experiência do usuário
- Fosse responsiva e acessível
- Mantivesse performance otimizada
- Seguisse padrões modernos de desenvolvimento
- Integrasse perfeitamente com a API backend
- Facilitasse manutenção e evolução

### Restrições
- Time pequeno (1-2 desenvolvedores)
- Necessidade de desenvolvimento rápido
- Requisito de alta qualidade de código
- Necessidade de SEO e performance
- Integração com API REST/JSON

### Stakeholders
- Desenvolvedores frontend
- Desenvolvedores backend
- Product Manager
- UX/UI Designers
- End users

---

## 🏗️ Decisão

### Arquitetura Escolhida: Next.js 15 com Domain-Driven Design

#### Estrutura de Camadas

```
src/
├── app/              # App Router (Next.js 15)
│   ├── _components/  # Componentes específicos da aplicação
│   └── globals.css   # Estilos globais
├── components/       # Componentes reutilizáveis (UI)
│   └── ui/          # Componentes base (Shadcn UI)
├── data/            # Camada de dados (DDD)
│   ├── products/    # Domínio de produtos
│   ├── categories/  # Domínio de categorias
│   └── shared/      # Utilitários compartilhados
├── lib/             # Utilitários e hooks
│   └── hooks/       # Custom hooks
└── types/           # Tipos TypeScript
```

#### Princípios Aplicados

1. **Domain-Driven Design**: Separação clara por domínios
2. **Component-Based Architecture**: Componentes reutilizáveis
3. **Data Layer Pattern**: Camada de dados separada
4. **Contract Pattern**: Tipos e validação compartilhados
5. **Custom Hooks**: Lógica reutilizável

---

## ⚡ Consequências

### ✅ Vantagens

#### Performance
- **Server-Side Rendering**: Melhor SEO e performance inicial
- **Static Generation**: Páginas estáticas quando possível
- **Code Splitting**: Carregamento otimizado
- **Image Optimization**: Otimização automática de imagens

#### Developer Experience
- **Type Safety**: TypeScript em toda a aplicação
- **Hot Reload**: Desenvolvimento rápido
- **Built-in Optimizations**: Next.js otimiza automaticamente
- **Modern Tooling**: ESLint, Prettier, Jest integrados

#### User Experience
- **Responsive Design**: Funciona em todos os dispositivos
- **Accessibility**: Componentes acessíveis (Shadcn UI)
- **Modern UI**: Interface limpa e intuitiva
- **Fast Interactions**: Interações fluidas e responsivas

#### Manutenibilidade
- **Clear Structure**: Estrutura clara e organizada
- **Reusable Components**: Componentes modulares
- **Testable Code**: Código facilmente testável
- **Scalable Architecture**: Fácil de estender

### ⚠️ Desvantagens

#### Complexidade
- **Learning Curve**: Next.js 15 tem novas features
- **Bundle Size**: Framework pode adicionar peso
- **Configuration**: Configuração inicial complexa
- **Debugging**: Debugging pode ser mais complexo

#### Vendor Lock-in
- **Next.js Specific**: Algumas features são específicas do Next.js
- **Migration Cost**: Migração para outro framework seria custosa
- **Version Updates**: Atualizações podem quebrar código

---

## 🔄 Alternativas Consideradas

### 1. Create React App (CRA)
```
src/
├── components/
├── pages/
└── utils/
```

**❌ Rejeitado**: Sem SSR, performance inferior, menos otimizações

### 2. Vite + React
```
src/
├── components/
├── pages/
└── utils/
```

**❌ Rejeitado**: Sem SSR nativo, configuração manual necessária

### 3. Remix
```
app/
├── routes/
├── components/
└── utils/
```

**❌ Rejeitado**: Menos maduro, ecossistema menor

### 4. SvelteKit
```
src/
├── routes/
├── components/
└── lib/
```

**❌ Rejeitado**: Stack diferente, curva de aprendizado

---

## 🛠️ Implementação

### Estrutura de Domínio

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

### Componentes

#### UI Components (Shadcn UI)
```typescript
// components/ui/button.tsx
// Shadcn UI é construído sobre primitivos do Radix UI
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

## 📊 Métricas de Sucesso

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
- **Responsive Design**: Funciona em todos os dispositivos ✅
- **Accessibility**: WCAG 2.1 AA compliance ✅
- **Loading States**: Feedback visual adequado ✅
- **Error Handling**: Tratamento de erros robusto ✅

### Code Quality
- **Bundle Size**: < 500KB ✅
- **Code Splitting**: Implementado ✅
- **Tree Shaking**: Funcionando ✅
- **Minification**: Otimizado ✅

---

## 🔄 Revisão e Evolução

### Critérios de Revisão
- **Anual**: Revisão completa da arquitetura
- **Trimestral**: Avaliação de performance
- **Mensal**: Revisão de métricas de qualidade

### Triggers para Mudança
- **Performance**: Se Lighthouse Score < 80
- **Bundle Size**: Se > 1MB
- **Build Time**: Se > 60s
- **User Feedback**: Se UX score < 4.0

### Evolução Planejada
- **Fase 2**: Implementação de PWA
- **Fase 3**: Otimizações avançadas de performance
- **Fase 4**: Migração para React Server Components
- **Fase 5**: Implementação de streaming SSR

---

## 📚 Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

*ADR criado por: Thiago Murtinho*  
*Versão: 1.0*  
*Data: Agosto 2025* 