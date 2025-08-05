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

## 🚀 Quick Start

```bash
# Clone and start everything in production mode
git clone <your-repository>
cd full-stack-product-and-category
pnpm start:prod
```

This will automatically:
- ✅ Install dependencies
- ✅ Start PostgreSQL database
- ✅ Setup and seed the database
- ✅ Build and start all services
- ✅ Open browsers for Frontend, API Docs, and Prisma Studio

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

### Option 1: Production Setup (Recommended)

```bash
git clone <your-repository>
cd full-stack-product-and-category

# Run complete production setup
pnpm start:prod
```

**This will automatically:**
- ✅ Install all dependencies
- ✅ Start PostgreSQL database
- ✅ Setup and seed the database
- ✅ Build API and Web for production (ignoring ESLint warnings)
- ✅ Start all services in production mode
- ✅ Start Prisma Studio for database management
- ✅ Open browsers automatically for:
  - 🌐 Frontend: http://localhost:3000
  - 📚 API Docs: http://localhost:5000/api/docs
  - 🗄️ Prisma Studio: http://localhost:5555 (opens automatically)

**Services will be available at:**
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend: http://localhost:5000
- 📚 API Docs: http://localhost:5000/api/docs
- 🗄️ Prisma Studio: http://localhost:5555

### Option 2: Alternative Setup Methods

#### Method A: Using bash scripts directly
```bash
git clone <your-repository>
cd full-stack-product-and-category

# Run complete production setup
./setup.sh
```

#### Method B: Manual step-by-step setup
```bash
git clone <your-repository>
cd full-stack-product-and-category

# Install all workspace dependencies
pnpm install

# Start database
docker-compose up -d postgres

# Setup database with sample data
pnpm db:setup

# Start development servers
pnpm dev
```

**Services will be available at:**
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- API Documentation: http://localhost:5000/api/docs
- Prisma Studio: http://localhost:5555

---

## 📊 Sample Data

The project comes with pre-loaded sample data:

- **50+ Categories** organized hierarchically (Electronics > Computers > Laptops, etc.)
- **60+ Products** from technology (laptops, smartphones, components, etc.)
- **Relationships** between products and categories

---

## 🔧 Build Configuration

The project is configured to build successfully even with ESLint warnings and TypeScript errors:

- **Next.js Config**: ESLint and TypeScript errors are ignored during build
- **ESLint Config**: Relaxed rules for `@typescript-eslint/no-explicit-any` and `react/no-unescaped-entities`
- **Build Process**: Optimized for production with all services running in background

## 🔧 Useful Scripts

### Production Scripts (Recommended)
```bash
# Primary commands (using pnpm)
pnpm start:prod         # Complete production setup and start all services
pnpm stop               # Stop all running services
pnpm status             # Check status of all services
pnpm restart            # Restart all services

# Alternative commands (using bash scripts directly)
./setup.sh              # Complete production setup and start all services
./stop-services.sh      # Stop all running services
./status.sh             # Check status of all services
./restore-turbopack.sh  # Restore Turbopack for development
```

### Package.json Commands (from root)
```bash
pnpm start:prod         # Start all services in production mode
pnpm stop               # Stop all running services
pnpm status             # Check status of all services
pnpm restart            # Restart all services
pnpm logs               # List log files
pnpm logs:api           # Follow API logs
pnpm logs:web           # Follow Web logs
pnpm logs:prisma        # Follow Prisma Studio logs
pnpm clean              # Clean log files
pnpm restore-turbopack  # Restore Turbopack for development
```

### Workspace Commands (from root)
```bash
# 🚀 Production (Recommended)
pnpm start:prod   # Start all services in production mode
pnpm stop         # Stop all running services
pnpm status       # Check status of all services
pnpm restart      # Restart all services

# 🔧 Development
pnpm dev          # Start both backend and frontend (development)
pnpm dev:api      # Start backend only (development)
pnpm dev:web      # Start frontend only (development)

# 🏗️ Build & Test
pnpm build        # Build all packages
pnpm test         # Run all tests

# 🗄️ Database
pnpm db:setup     # Setup database with sample data
pnpm docker:up    # Start database
pnpm docker:down  # Stop database

# 📄 Logs & Maintenance
pnpm logs         # List log files
pnpm logs:api     # Follow API logs
pnpm logs:web     # Follow Web logs
pnpm logs:prisma  # Follow Prisma Studio logs
pnpm clean        # Clean log files
pnpm restore-turbopack  # Restore Turbopack for development
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