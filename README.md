# Full Stack Product and Category

## 📋 Summary

This project is a full-stack application showcasing a robust architecture and modern development practices. It includes:

- **Backend**: Built with Express.js, TypeScript, and Prisma ORM, following Functional Core/Imperative Shell and Domain-Driven Design (DDD) principles. It features Swagger API documentation and a clear separation of layers (domain, repository, handler, routes, middleware).
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
- **Dedicated products page** with category tree path navigation
- **Category path composition** showing full hierarchy in URLs

![Swagger API Documentation](https://github.com/thiagomurtinho/full-stack-product-and-category/raw/main/doc/img/swagger.png)

![Frontend Interface](https://github.com/thiagomurtinho/full-stack-product-and-category/raw/main/doc/img/page.png)

## 📚 Documentation

This project includes comprehensive documentation for both technical and product aspects:

### Product Documentation
- **[Product Requirements](doc/PRODUCT_REQUIREMENTS.md)** | **[(PT-BR)](doc/PRODUCT_REQUIREMENTS_PT_BR.md)** - Complete functional and non-functional requirements

### Architecture Decision Records (ADRs)
- **[Backend ADR](doc/ADR_BACKEND.md)** | **[(PT-BR)](doc/ADR_BACKEND_PT_BR.md)**  - Domain-Driven Design with Functional Core/Imperative Shell
- **[Frontend ADR](doc/ADR_FRONTEND.md)** | **[(PT-BR)](doc/ADR_FRONTEND_PT_BR.md)**- Next.js 15 with Domain-Driven Design

These documents provide detailed insights into the architectural decisions, requirements, and implementation strategies used in this project.

## 🚀 Quick Start

```bash
# Clone and start everything in interactive development mode (DEFAULT)
git clone <your-repository>
cd full-stack-product-and-category
npm run dev
```

This will automatically:
- ✅ Install dependencies
- ✅ Start PostgreSQL database
- ✅ Setup and seed the database
- ✅ Build and start all services
- ✅ Show real-time logs
- ✅ Open browsers for Frontend, API Docs, and Prisma Studio
- ✅ **Press Ctrl+C to stop all services**

---

## 📑 Index

1. [Documentation](#-documentation)
2. [Technical Questions & Answers](#-technical-questions--answers)
   - [1.1 Frontend Implementation: Dedicated Products Page](#frontend-implementation-dedicated-products-page-with-category-tree-navigation)
3. [Architecture](#-architecture)
   - [Backend](#backend)
   - [Frontend](#frontend)
4. [Testing](#-testing)
5. [Quick Setup](#-quick-setup)
6. [Sample Data](#-sample-data)
7. [Useful Scripts](#-useful-scripts)
8. [API Endpoints](#-api-endpoints)
9. [Implemented Features](#-implemented-features)
10. [Technologies Used](#-technologies-used)
11. [Key Highlights](#-key-highlights)

---

## ❓ Technical Questions & Answers

### 1. **How to implement a product that is a child of a tree with N parent levels?**

**Implemented Answer:**
- **Schema**: Product has `categoryIds: string[]` in schema (`api/src/domain/products/product.contract.ts`)
- **Relationship**: Many-to-many between Product and Category via junction table
- **Structure**: Categories have `parentId` for hierarchy, Products have array of `categoryIds`

Example API Request:
```bash
curl -X GET http://localhost:5005/api/categories
```

Example Response:
```json
[
  {
    "id": "7706f75a-1416-45e6-a5cb-d47ca16f3ac7",
    "name": "Electronics",
    "slug": "electronics",
    "parentId": null,
    "createdAt": "2025-08-05T16:43:37.093Z",
    "updatedAt": "2025-08-05T16:43:37.093Z"
  },
  {
    "id": "ac370b9b-c530-4e4b-bd9e-7cbdcfde0d6a",
    "name": "Computers",
    "slug": "computers",
    "parentId": "7706f75a-1416-45e6-a5cb-d47ca16f3ac7",
    "createdAt": "2025-08-05T16:43:37.099Z",
    "updatedAt": "2025-08-05T16:43:37.099Z"
  }
]
```

#### **Frontend Implementation: Dedicated Products Page with Category Tree Navigation**

The application features a dedicated products page that demonstrates the category tree path functionality. Users can navigate through the hierarchical category structure, and the URL dynamically composes the full path showing the complete category hierarchy.

**Features:**
- **Dynamic URL composition**: URLs reflect the complete category path (e.g., `/products/electronics/computers/laptops`)
- **Breadcrumb navigation**: Shows the full category hierarchy in the URL path
- **Category tree integration**: Seamless navigation through nested categories
- **Responsive design**: Works across all device sizes

![Frontend Product Screen](https://github.com/thiagomurtinho/full-stack-product-and-category/raw/main/doc/img/product-page.png)

**Example URL Structure:**
```
/products/electronics/computers/laptops/gaming-laptops
/products/electronics/smartphones/iphone
/products/electronics/components/processors
```

### 2. **How to build the final URL-style path for categories?**

**Implemented Answer:**
- **Location**: Implemented in repository (`api/src/domain/categories/category.repository.ts`)
- **Contract**: Defined in `category.contract.ts` with `categoryPathSchema`
- **Handler**: Used in `product.handler.ts` to enrich products

Example API Request:
```bash
curl -X GET http://localhost:5005/api/categories/path/gaming-laptops
```

Example Response:
```json
{
  "id": "2d120850-086e-4e6a-b8b9-97ee13e7a94b",
  "name": "Gaming Laptops",
  "slug": "gaming-laptops",
  "parentId": "0d583d96-7d0a-4987-92ce-d7ea1dde8551",
  "createdAt": "2025-08-05T16:43:37.103Z",
  "updatedAt": "2025-08-05T16:43:37.103Z",
  "path": {
    "ids": [
      "7706f75a-1416-45e6-a5cb-d47ca16f3ac7",
      "ac370b9b-c530-4e4b-bd9e-7cbdcfde0d6a",
      "0d583d96-7d0a-4987-92ce-d7ea1dde8551",
      "2d120850-086e-4e6a-b8b9-97ee13e7a94b"
    ],
    "names": [
      "Electronics",
      "Computers",
      "Laptops",
      "Gaming Laptops"
    ],
    "slugs": [
      "electronics",
      "computers",
      "laptops",
      "gaming-laptops"
    ],
    "fullPath": "electronics/computers/laptops/gaming-laptops"
  }
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
  name      String
  slug      String   @unique
  parentId  String?
  parent    Category? @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children  Category[] @relation("CategoryHierarchy")
  products  Product[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("categories")
}

model Product {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  price       Float
  imageUrl    String?
  categories  Category[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
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
- npm (package manager)

### Option 1: Interactive Development Mode (DEFAULT)

```bash
git clone <your-repository>
cd full-stack-product-and-category

# Start in interactive mode with real-time logs (DEFAULT)
npm run dev
```

**This will automatically:**
- ✅ Install all dependencies
- ✅ Start PostgreSQL database
- ✅ Setup and seed the database
- ✅ Build API and Web for production
- ✅ Start all services with real-time logs
- ✅ Open browsers automatically
- ✅ **Press Ctrl+C to stop all services**

**Services will be available at:**
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend: http://localhost:5005
- 📚 API Docs: http://localhost:5005/api/docs
- 🗄️ Prisma Studio: http://localhost:5555

### Option 2: Production Setup

```bash
git clone <your-repository>
cd full-stack-product-and-category

# Run complete production setup (background mode)
npm run start:prod
```

**This will automatically:**
- ✅ Install all dependencies
- ✅ Start PostgreSQL database
- ✅ Setup and seed the database
- ✅ Build API and Web for production
- ✅ Start all services in background mode
- ✅ Start Prisma Studio for database management
- ✅ Open browsers automatically

**Services will be available at:**
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend: http://localhost:5005
- 📚 API Docs: http://localhost:5005/api/docs
- 🗄️ Prisma Studio: http://localhost:5555

### Option 3: Alternative Setup Methods

#### Method A: Using bash scripts directly
```bash
git clone <your-repository>
cd full-stack-product-and-category

# Interactive mode (development) - DEFAULT
bash setup.sh

# Production mode
bash setup-production.sh
```

#### Method B: Manual step-by-step setup
```bash
git clone <your-repository>
cd full-stack-product-and-category

# Install all workspace dependencies
npm install

# Start database
docker-compose up -d postgres

# Setup database with sample data
npm run db:setup

# Start development servers
npm run dev
```

**Services will be available at:**
- Backend: http://localhost:5005
- Frontend: http://localhost:3000
- API Documentation: http://localhost:5005/api/docs
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

### Development Scripts (DEFAULT)
```bash
# 🚀 Interactive Development (DEFAULT)
npm run dev              # Start with real-time logs and Ctrl+C to stop
npm run start            # Alternative command

# 🏭 Production
npm run start:prod       # Complete production setup and start all services
npm run stop             # Stop all running services
npm run status           # Check status of all services
npm run restart          # Restart all services

# Alternative commands (using bash scripts directly)
bash setup.sh            # Interactive development mode (DEFAULT)
bash setup-production.sh # Production setup
bash stop-all.sh         # Stop all services
bash status.sh           # Check status of all services
```

### Package.json Commands (from root)
```bash
# 🚀 Development (Interactive) - DEFAULT
npm run dev              # Start with real-time logs and Ctrl+C to stop
npm run start            # Alternative command

# 🏭 Production
npm run start:prod       # Start all services in production mode
npm run stop             # Stop all running services
npm run status           # Check status of all services
npm run restart          # Restart all services

# 📄 Logs & Maintenance
npm run logs             # List log files
npm run logs:api         # Follow API logs
npm run logs:web         # Follow Web logs
npm run logs:prisma      # Follow Prisma Studio logs
npm run clean            # Clean log files
npm run restore-turbopack # Restore Turbopack for development
```

### Workspace Commands (from root)
```bash
# 🚀 Development (Interactive) - DEFAULT
npm run dev              # Start with real-time logs and Ctrl+C to stop
npm run start            # Alternative command

# 🏭 Production
npm run start:prod       # Start all services in production mode
npm run stop             # Stop all running services
npm run status           # Check status of all services
npm run restart          # Restart all services

# 🔧 Development
npm run dev:api          # Start backend only (development)
npm run dev:web          # Start frontend only (development)

# 🏗️ Build & Test
npm run build            # Build all packages
npm run test             # Run all tests

# 🗄️ Database
npm run db:setup         # Setup database with sample data
npm run docker:up        # Start database
npm run docker:down      # Stop database

# 📄 Logs & Maintenance
npm run logs             # List log files
npm run logs:api         # Follow API logs
npm run logs:web         # Follow Web logs
npm run logs:prisma      # Follow Prisma Studio logs
npm run clean            # Clean log files
npm run restore-turbopack # Restore Turbopack for development
```

### Backend (api/)
```bash
npm run dev              # Development
npm run build            # Build for production
npm run start            # Production
npm run test             # Run tests
npm run db:reset         # Reset database + seeds
```

### Frontend (web/)
```bash
npm run dev              # Development
npm run build            # Build for production
npm run start            # Production
npm run test             # Run tests
```

---

## 📚 API Endpoints

### Health
- `GET /api/health` - Health check

### Categories
- `GET /api/categories` - List categories (with pagination)
- `GET /api/categories/count` - Count categories
- `GET /api/categories/{id}` - Get category by ID
- `GET /api/categories/slug/{slug}` - Get category by slug
- `GET /api/categories/path/{slug}` - Get category with full path
- `GET /api/categories/children/{parentId}` - Get category children
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Products
- `GET /api/products` - List products (with pagination, filters, search)
- `GET /api/products/count` - Count products
- `GET /api/products/search` - Fuzzy search products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/slug/{slug}` - Get product by slug
- `GET /api/products/by-category/{path}` - Get products by category path
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

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
- ✅ **Dedicated products page with category tree navigation**
- ✅ **Dynamic URL composition for category paths**
- ✅ **Interactive development mode with real-time logs (DEFAULT)**

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
6. **Simple and efficient setup** with Docker and npm workspaces
7. **Interactive development mode** with real-time logs and easy service control (DEFAULT)

The project is designed to showcase robust development practices and is ready to run with the provided setup instructions.