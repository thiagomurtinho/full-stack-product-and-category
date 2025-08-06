-- Inicialização do banco de dados PostgreSQL
-- Este arquivo é executado automaticamente quando o container é criado pela primeira vez

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurações de timezone
SET timezone = 'UTC';

-- Comentário sobre o banco
COMMENT ON DATABASE fullstack_product_and_category IS 'Database for Full Stack Product and Category Project'; 