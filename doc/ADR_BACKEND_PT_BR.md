# ADR-001: Arquitetura Backend - Domain-Driven Design com Functional Core/Imperative Shell

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
Precisávamos desenvolver uma API robusta para gestão de produtos e categorias que:

- Mantivesse separação clara de responsabilidades
- Fosse facilmente testável
- Seguisse princípios SOLID
- Permitisse evolução contínua
- Garantisse type safety
- Facilitasse manutenção e debugging

### Restrições
- Time pequeno (1-2 desenvolvedores)
- Necessidade de desenvolvimento rápido
- Requisito de alta qualidade de código
- Necessidade de documentação clara
- Integração com frontend React/Next.js

### Stakeholders
- Desenvolvedores backend
- Desenvolvedores frontend
- Product Manager
- QA Engineers

---

## 🏗️ Decisão

### Arquitetura Escolhida: Domain-Driven Design (DDD) com Functional Core/Imperative Shell

#### Estrutura de Camadas

```
src/
├── domain/           # Core de negócio (Functional Core)
│   ├── products/     # Domínio de produtos
│   └── categories/   # Domínio de categorias
├── adapters/         # Adaptadores externos (Imperative Shell)
│   └── database/     # Adaptador de banco de dados
├── handlers/         # Controllers HTTP
├── routes/           # Definição de rotas
├── middleware/       # Middlewares Express
└── config/           # Configurações
```

#### Princípios Aplicados

1. **Functional Core**: Lógica de negócio pura e testável
2. **Imperative Shell**: Interação com sistemas externos
3. **Repository Pattern**: Abstração de acesso a dados
4. **Contract Pattern**: Validação e tipos compartilhados
5. **Handler Pattern**: Controllers limpos e focados

---

## ⚡ Consequências

### ✅ Vantagens

#### Manutenibilidade
- **Separação clara**: Cada camada tem responsabilidade específica
- **Baixo acoplamento**: Mudanças em uma camada não afetam outras
- **Alta coesão**: Código relacionado fica junto
- **Testabilidade**: Cada camada pode ser testada isoladamente

#### Escalabilidade
- **Adição de features**: Novos domínios seguem o mesmo padrão
- **Refatoração segura**: Mudanças localizadas
- **Performance**: Otimizações podem ser feitas por camada
- **Debugging**: Problemas são facilmente isolados

#### Qualidade
- **Type safety**: TypeScript em toda a aplicação
- **Validação robusta**: Zod para schemas e validação
- **Documentação**: Swagger gerado automaticamente
- **Testes**: Cobertura > 80% com Jest

### ⚠️ Desvantagens

#### Complexidade
- **Curva de aprendizado**: DDD requer conhecimento específico
- **Boilerplate**: Mais arquivos e estrutura inicial
- **Overhead**: Pode ser excessivo para projetos simples

#### Performance
- **Camadas extras**: Mais indireção pode impactar performance
- **Memory usage**: Mais objetos em memória
- **Startup time**: Mais módulos para carregar

---

## 🔄 Alternativas Consideradas

### 1. Arquitetura Monolítica Tradicional
```
src/
├── controllers/
├── services/
├── models/
└── routes/
```

**❌ Rejeitado**: Falta de separação clara, difícil de testar, acoplamento alto

### 2. Clean Architecture (Hexagonal)
```
src/
├── entities/
├── usecases/
├── interfaces/
└── infrastructure/
```

**❌ Rejeitado**: Muito complexo para o escopo, overhead desnecessário

### 3. MVC Clássico
```
src/
├── models/
├── views/
└── controllers/
```

**❌ Rejeitado**: Não adequado para APIs, mistura responsabilidades

### 4. Microserviços
```
services/
├── product-service/
├── category-service/
└── gateway/
```

**❌ Rejeitado**: Complexidade desnecessária para o escopo atual

---

## 🛠️ Implementação

### Estrutura de Domínio

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

### Adaptadores

#### Database Adapter
```typescript
// adapters/database/database.adapter.ts
export class DatabaseAdapter implements ProductRepository, CategoryRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findAll(params: FindAllParams): Promise<Product[]> {
    // Implementação com Prisma
  }
  
  async findById(id: string): Promise<Product | null> {
    // Implementação com Prisma
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

## 📊 Métricas de Sucesso

### Qualidade de Código
- **Cobertura de testes**: > 80% ✅
- **Complexidade ciclomática**: < 10 por função ✅
- **Duplicação de código**: < 5% ✅
- **Débito técnico**: Baixo ✅

### Performance
- **Tempo de resposta**: < 200ms ✅
- **Throughput**: > 1000 req/s ✅
- **Memory usage**: < 100MB ✅
- **Startup time**: < 5s ✅

### Manutenibilidade
- **Tempo para adicionar feature**: < 2 horas ✅
- **Tempo para debugar issue**: < 30 minutos ✅
- **Documentação**: 100% dos endpoints ✅
- **Type safety**: 100% do código ✅

---

## 🔄 Revisão e Evolução

### Critérios de Revisão
- **Anual**: Revisão completa da arquitetura
- **Trimestral**: Avaliação de performance
- **Mensal**: Revisão de métricas de qualidade

### Triggers para Mudança
- **Performance**: Se tempo de resposta > 500ms
- **Escalabilidade**: Se não suportar 10x mais dados
- **Manutenibilidade**: Se tempo de desenvolvimento > 2x
- **Qualidade**: Se cobertura de testes < 70%

### Evolução Planejada
- **Fase 2**: Adição de cache layer
- **Fase 3**: Implementação de event sourcing
- **Fase 4**: Migração para microserviços (se necessário)

---

## 📚 Referências

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Functional Core, Imperative Shell](https://medium.com/ssense-tech/a-look-at-the-functional-core-and-imperative-shell-pattern-be2498da153a)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)

---

*ADR criado por: Thiago Murtinho*  
*Versão: 1.0*  
*Data: Agosto 2025* 