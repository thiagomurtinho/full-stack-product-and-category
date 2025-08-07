# ADR-001: Backend Architecture - Domain-Driven Design with Functional Core/Imperative Shell

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
We needed to develop a robust API for product and category management that:

- Maintained clear separation of responsibilities
- Was easily testable
- Followed SOLID principles
- Allowed continuous evolution
- Ensured type safety
- Facilitated maintenance and debugging

### Constraints
- Small team (1-2 developers)
- Need for rapid development
- Requirement for high code quality
- Need for clear documentation
- Integration with React/Next.js frontend

### Stakeholders
- Backend developers
- Frontend developers
- Product Manager
- QA Engineers

---

## 🏗️ Decision

### Chosen Architecture: Domain-Driven Design (DDD) with Functional Core/Imperative Shell

#### Layer Structure

```
src/
├── domain/           # Business core (Functional Core)
│   ├── products/     # Product domain
│   └── categories/   # Category domain
├── adapters/         # External adapters (Imperative Shell)
│   └── database/     # Database adapter
├── handlers/         # HTTP controllers
├── routes/           # Route definitions
├── middleware/       # Express middlewares
└── config/           # Configurations
```

#### Applied Principles

1. **Functional Core**: Pure and testable business logic
2. **Imperative Shell**: Interaction with external systems
3. **Repository Pattern**: Data access abstraction
4. **Contract Pattern**: Shared validation and types
5. **Handler Pattern**: Clean and focused controllers

---

## ⚡ Consequences

### ✅ Advantages

#### Maintainability
- **Clear separation**: Each layer has specific responsibility
- **Low coupling**: Changes in one layer don't affect others
- **High cohesion**: Related code stays together
- **Testability**: Each layer can be tested in isolation

#### Scalability
- **Feature addition**: New domains follow the same pattern
- **Safe refactoring**: Localized changes
- **Performance**: Optimizations can be made per layer
- **Debugging**: Issues are easily isolated

#### Quality
- **Type safety**: TypeScript throughout the application
- **Robust validation**: Zod for schemas and validation
- **Documentation**: Automatically generated Swagger
- **Testing**: > 80% coverage with Jest

### ⚠️ Disadvantages

#### Complexity
- **Learning curve**: DDD requires specific knowledge
- **Boilerplate**: More files and initial structure
- **Overhead**: May be excessive for simple projects

#### Performance
- **Extra layers**: More indirection may impact performance
- **Memory usage**: More objects in memory
- **Startup time**: More modules to load

---

## 🔄 Alternatives Considered

### 1. Traditional Monolithic Architecture
```
src/
├── controllers/
├── services/
├── models/
└── routes/
```

**❌ Rejected**: Lack of clear separation, difficult to test, high coupling

### 2. Clean Architecture (Hexagonal)
```
src/
├── entities/
├── usecases/
├── interfaces/
└── infrastructure/
```

**❌ Rejected**: Too complex for scope, unnecessary overhead

### 3. Classic MVC
```
src/
├── models/
├── views/
└── controllers/
```

**❌ Rejected**: Not suitable for APIs, mixes responsibilities

### 4. Microservices
```
services/
├── product-service/
├── category-service/
└── gateway/
```

**❌ Rejected**: Unnecessary complexity for current scope

---

## 🛠️ Implementation

### Domain Structure

#### Product Domain
```typescript
// domain/products/product.contract.ts
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

// domain/products/product.repository.ts
export interface ProductRepository {
  findAll(params: FindAllParams): Promise<Product[]>
  findById(id: string): Promise<Product | null>
  create(data: CreateProductData): Promise<Product>
  update(id: string, data: UpdateProductData): Promise<Product>
  delete(id: string): Promise<void>
}
```

#### Category Domain
```typescript
// domain/categories/category.repository.ts
export interface CategoryRepository {
  findAll(): Promise<Category[]>
  findById(id: string): Promise<Category | null>
  findBySlug(slug: string): Promise<Category | null>
  findPathBySlug(slug: string): Promise<CategoryWithPath | null>
  create(data: CreateCategoryData): Promise<Category>
  update(id: string, data: UpdateCategoryData): Promise<Category>
  delete(id: string): Promise<void>
}
```

### Adapters

#### Database Adapter
```typescript
// adapters/database/database.adapter.ts
export class DatabaseAdapter implements ProductRepository, CategoryRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findAll(params: FindAllParams): Promise<Product[]> {
    // Prisma implementation
  }
  
  async findById(id: string): Promise<Product | null> {
    // Prisma implementation
  }
}
```

### Handlers

#### Product Handler
```typescript
// handlers/product.handler.ts
export class ProductHandler {
  constructor(private productRepository: ProductRepository) {}
  
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const params = this.parseQueryParams(req.query)
      const products = await this.productRepository.findAll(params)
      res.json(products)
    } catch (error) {
      this.handleError(error, res)
    }
  }
}
```

---

## 📊 Success Metrics

### Code Quality
- **Test coverage**: > 80% ✅
- **Cyclomatic complexity**: < 10 per function ✅
- **Code duplication**: < 5% ✅
- **Technical debt**: Low ✅

### Performance
- **Response time**: < 200ms ✅
- **Throughput**: > 1000 req/s ✅
- **Memory usage**: < 100MB ✅
- **Startup time**: < 5s ✅

### Maintainability
- **Time to add feature**: < 2 hours ✅
- **Time to debug issue**: < 30 minutes ✅
- **Documentation**: 100% of endpoints ✅
- **Type safety**: 100% of code ✅

---

## 🔄 Review and Evolution

### Review Criteria
- **Annual**: Complete architecture review
- **Quarterly**: Performance evaluation
- **Monthly**: Quality metrics review

### Change Triggers
- **Performance**: If response time > 500ms
- **Scalability**: If can't support 10x more data
- **Maintainability**: If development time > 2x
- **Quality**: If test coverage < 70%

### Planned Evolution
- **Phase 2**: Cache layer addition
- **Phase 3**: Event sourcing implementation
- **Phase 4**: Microservices migration (if needed)

---

## 📚 References

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Functional Core, Imperative Shell](https://medium.com/ssense-tech/a-look-at-the-functional-core-and-imperative-shell-pattern-be2498da153a)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)

---

*ADR criado por: Thiago Murtinho*  
*Versão: 1.0*  
*Data: August 2025* 