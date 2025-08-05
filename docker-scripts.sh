#!/bin/bash

# Script para gerenciar o PostgreSQL no Docker
# Uso: ./docker-scripts.sh [comando]

set -e

case "$1" in
    "start")
        echo "🚀 Iniciando PostgreSQL..."
        docker-compose up -d postgres
        echo "✅ PostgreSQL iniciado!"
        echo "📊 Status:"
        docker-compose ps
        ;;
    "stop")
        echo "🛑 Parando PostgreSQL..."
        docker-compose down
        echo "✅ PostgreSQL parado!"
        ;;
    "restart")
        echo "🔄 Reiniciando PostgreSQL..."
        docker-compose restart postgres
        echo "✅ PostgreSQL reiniciado!"
        ;;
    "logs")
        echo "📋 Mostrando logs do PostgreSQL..."
        docker-compose logs -f postgres
        ;;
    "status")
        echo "📊 Status do PostgreSQL:"
        docker-compose ps
        ;;
    "connect")
        echo "🔌 Conectando ao PostgreSQL..."
        docker-compose exec postgres psql -U postgres -d fullstack_product_and_category
        ;;
    "backup")
        echo "💾 Criando backup do banco..."
        docker-compose exec postgres pg_dump -U postgres fullstack_product_and_category > backup_$(date +%Y%m%d_%H%M%S).sql
        echo "✅ Backup criado!"
        ;;
    "reset")
        echo "⚠️  ATENÇÃO: Isso vai apagar todos os dados!"
        read -p "Tem certeza? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🗑️  Removendo volumes e containers..."
            docker-compose down -v
            echo "🔄 Iniciando PostgreSQL limpo..."
            docker-compose up -d postgres
            echo "✅ PostgreSQL resetado!"
        else
            echo "❌ Operação cancelada."
        fi
        ;;
    "health")
        echo "🏥 Verificando saúde do PostgreSQL..."
        docker-compose exec postgres pg_isready -U postgres -d fullstack_product_and_category
        ;;
    "setup")
        echo "🔧 Configurando ambiente..."
        if [ ! -f "api/.env" ]; then
            echo "📝 Criando arquivo .env..."
            cp api/env.example api/.env
            echo "✅ Arquivo .env criado!"
        else
            echo "ℹ️  Arquivo .env já existe."
        fi
        echo "🚀 Iniciando PostgreSQL..."
        docker-compose up -d postgres
        echo "⏳ Aguardando PostgreSQL estar pronto..."
        sleep 10
        echo "🏥 Verificando saúde..."
        docker-compose exec postgres pg_isready -U postgres -d fullstack_product_and_category
        echo "✅ Setup completo!"
        ;;
    *)
        echo "📖 Uso: $0 [comando]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  start   - Iniciar PostgreSQL"
        echo "  stop    - Parar PostgreSQL"
        echo "  restart - Reiniciar PostgreSQL"
        echo "  logs    - Ver logs"
        echo "  status  - Ver status"
        echo "  connect - Conectar ao banco"
        echo "  backup  - Criar backup"
        echo "  reset   - Reset completo (apaga dados)"
        echo "  health  - Verificar saúde"
        echo "  setup   - Configurar ambiente completo"
        ;;
esac 