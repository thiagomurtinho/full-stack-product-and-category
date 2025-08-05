# Full Stack Product and Category

## 📋 Summary

This project is a full-stack application showcasing a robust architecture and modern development practices. It includes:

- **Backend**: Built with Express.js, TypeScript, and Prisma ORM, following Domain-Driven Design (DDD) principles. It features Swagger API documentation and a clear separation of layers (domain, repository, handler, routes, middleware).
- **Frontend**: Developed with Next.js 15 and React 19, implementing DDD with a separate data layer and reusable contracts. The interface is modern, responsive, and styled with Tailwind CSS and Radix UI.
- **Testing**: Comprehensive unit and integration tests for both backend and frontend, achieving 80% test coverage.
- **Database**: PostgreSQL managed via Docker, with Prisma ORM for schema and migrations.

Key features include:

- Product CRUD operations
- Hierarchical category system
- Pagination, filters, order by and search
- Validation with Zod
- API documentation with Swagger
- Modern UI with dialogs for create/edit, delete modals, and category filters

![Swagger API Documentation](https://github.com/thiagomurtinho/full-stack-product-and-category/raw/main/doc/img/swagger.png)

![Frontend Interface](https://github.com/thiagomurtinho/full-stack-product-and-category/raw/main/doc/img/page.png)

---

## 📑 Index

1. [Technical Questions & Answers](#-technical-questions--answers)
2. [Architecture](#-architecture)
   - [Backend](#backend)
   - [Frontend](#frontend)
3. [Testing](#-testing)
4. [Quick Setup](#-quick-setup)
5. [Sample Data](#-sample-data)
6. [Useful Scripts](#-useful-scripts)
7. [API Endpoints](#-api-endpoints)
8. [Implemented Features](#-implemented-features)
9. [Technologies Used](#-technologies-used)
10. [Key Highlights](#-key-highlights)

---

## ❓ Technical Questions & Answers

### 1. **How to implement a product that is a child of a tree with N parent levels?**

**Implemented Answer:**
- **Schema**: Product has `categoryIds: string[]` in schema (`api/src/domain/products/product.contract.ts`)
- **Relationship**: Many-to-many between Product and Category via junction table
- **Structure**: Categories have `parentId` for hierarchy, Products have array of `categoryIds`

Example API Request:
```bash
curl -X GET http://localhost:5000/api/categories
```

Example Response:
```json
[
  {
    "id": "1",
    "name": "Electronics",
    "parentId": null,
    "children": [
      {
        "id": "2",
        "name": "Computers",
        "parentId": "1"
      }
    ]
  }
]
```

### 2. **How to build the final URL-style path for categories?**

**Implemented Answer:**
- **Location**: Implemented in repository (`api/src/domain/categories/category.repository.ts`)
- **Contract**: Defined in `category.contract.ts` with `categoryPathSchema`
- **Handler**: Used in `product.handler.ts` to enrich products

Example API Request:
```bash
curl -X GET http://localhost:5000/api/categories/1/path
```

Example Response:
```json
{
  "ids": ["1", "2"],
  "names": ["Electronics", "Computers"],
  "slugs": ["electronics", "computers"],
  "fullPath": "electronics/computers"
}
```

### 3. **How to implement this in SQL database?**

**Implemented Answer:**
- **Prisma Schema**: Hierarchy with `parentId` and relationships
- **Query**: Recursive queries to fetch complete paths
- **Performance**: Indexes on `parentId` and `slug`
- **Relationships**: Many-to-many between Product and Category using a junction table

```prisma
model Category {
  id        String   @id @default(uuid())
  parentId  String?
  parent    Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryHierarchy")
  products  Product[]
}

model Product {
  id          String   @id @default(uuid())
  categories  Category[] // Many-to-many relationship
}
```

---

## Extra: How to Implement Fuzzy Match Search in PostgreSQL

Fuzzy match search can be implemented in this project using Prisma and PostgreSQL with the `pg_trgm` extension. This allows for similarity-based searches directly in the database.

### Steps:

1. **Enable the `pg_trgm` extension in PostgreSQL**:
   ```sql
   CREATE EXTENSION pg_trgm;
   ```

2. **Update the Prisma schema**:
   Add a `@db.Text` annotation to the field you want to search (e.g., `name`):
   ```prisma
   model Product {
     id   String @id @default(uuid())
     name String @db.Text
   }
   ```

3. **Create a migration**:
   Run the following command to generate and apply the migration:
   ```bash
   npx prisma migrate dev --name add_pg_trgm_extension
   ```

4. **Create a GIN index for the searchable field**:
   Add a custom SQL migration to create the index:
   ```sql
   CREATE INDEX products_name_trgm_idx ON "Product" USING gin (name gin_trgm_ops);
   ```
   Save this SQL in a migration file and apply it using Prisma.

5. **Perform a similarity search in Prisma**:
   Use the `queryRaw` method to execute a custom SQL query:
   ```typescript
   import { prisma } from '../prisma';

   async function searchProducts(query: string) {
     return await prisma.$queryRaw`SELECT * FROM "Product" WHERE name % ${query} ORDER BY similarity(name, ${query}) DESC`;
   }
   ```

This approach leverages PostgreSQL's `pg_trgm` extension for efficient and accurate fuzzy matching, integrated seamlessly with Prisma.

---

## 🏗️ Architecture

### Backend (Functional Core/Imperative Shell)

- **Framework**: Express.js with TypeScript
- **Design**: Domain-Driven Design (DDD) with clear separation of concerns:
  - **Domain**: Business logic and contracts
  - **Repository**: Data access logic
  - **Handler**: HTTP controllers
  - **Routes**: Endpoint definitions
  - **Middleware**: Validation and error handling
- **Validation**: Zod for DTOs
- **Documentation**: Swagger for API documentation

### Frontend

- **Framework**: Next.js 15 with React 19
- **Design**: Domain-Driven Design (DDD) with a separate data layer and reusable contracts
- **Styling**: Tailwind CSS and Radix UI
- **State Management**: React Query
- **Forms**: React Hook Form
- **Tables**: TanStack Table

![Category Filters and Dialogs](https://github.com/thiagomurtinho/full-stack-product-and-category/raw/main/doc/img/page-filtered.png)

---

## 🧪 Testing

- **Backend**: Unit and integration tests with Jest, achieving 80% coverage.

![Backend Tests](https://github.com/thiagomurtinho/full-stack-product-and-category/raw/main/doc/img/api-test.png)

- **Frontend**: Component and integration tests with Jest, achieving 80% coverage.

![Frontend Tests](https://github.com/thiagomurtinho/full-stack-product-and-category/raw/main/doc/img/web-test.png)

---

## 🚀 Quick Setup

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- pnpm (recommended) or npm

### Option 1: Automated Setup (Recommended)

```bash
git clone <your-repository>
cd full-stack-product-and-category

# Run automated setup
bash setup.sh
# or: sh setup.sh
# or: chmod +x setup.sh && ./setup.sh
```

### Option 2: Manual Setup

#### 1. Clone and Install Dependencies

```bash
git clone <your-repository>
cd full-stack-product-and-category

# Install all workspace dependencies
pnpm install
```

#### 2. Start Database

```bash
# From project root
docker-compose up -d postgres
```

Wait a few seconds for the database to initialize completely.

#### 3. Setup Database

```bash
# Setup database with sample data
pnpm db:setup
```

#### 4. Start Development Servers

```bash
# Start both backend and frontend
pnpm dev

# Or start them separately:
# Backend: pnpm dev:api
# Frontend: pnpm dev:web
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- API Documentation: http://localhost:5000/api/docs

---

## 📊 Sample Data

The project comes with pre-loaded sample data:

- **50+ Categories** organized hierarchically (Electronics > Computers > Laptops, etc.)
- **60+ Products** from technology (laptops, smartphones, components, etc.)
- **Relationships** between products and categories

---

## 🔧 Useful Scripts

### Workspace Commands (from root)
```bash
pnpm dev          # Start both backend and frontend
pnpm dev:api      # Start backend only
pnpm dev:web      # Start frontend only
pnpm build        # Build all packages
pnpm test         # Run all tests
pnpm db:setup     # Setup database with sample data
pnpm docker:up    # Start database
pnpm docker:down  # Stop database
```

### Backend (api/)
```bash
pnpm dev          # Development
pnpm build        # Build for production
pnpm start        # Production
pnpm test         # Run tests
pnpm db:reset     # Reset database + seeds
```

### Frontend (web/)
```bash
pnpm dev          # Development
pnpm build        # Build for production
pnpm start        # Production
pnpm test         # Run tests
```

---

## 📚 API Endpoints

- `GET /api/health` - Health check
- `GET /api/categories` - List categories
- `GET /api/products` - List products (with pagination)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

---

## 🎯 Implemented Features

- ✅ Complete product CRUD
- ✅ Hierarchical category system
- ✅ Pagination and filters
- ✅ Zod validation
- ✅ Unit and integration tests
- ✅ Modern interface with Tailwind CSS
- ✅ Reusable components
- ✅ State management with React Query
- ✅ Forms with React Hook Form
- ✅ Tables with TanStack Table

---

## 🔍 Technologies Used

### Backend
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (validation)
- Jest (testing)
- Swagger (documentation)

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- TanStack Query
- React Hook Form
- TanStack Table

---

## 📝 Key Highlights

This project demonstrates:

1. **Clean architecture** with clear separation of concerns
2. **Testable code** with comprehensive test coverage
3. **Best practices** in modern full-stack development
4. **Responsive and user-friendly interface**
5. **Complete API documentation**
6. **Simple and efficient setup** with Docker and pnpm workspace

The project is designed to showcase robust development practices and is ready to run with the provided setup instructions.