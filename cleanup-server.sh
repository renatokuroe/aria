#!/bin/bash

# Script para limpar espaço em disco do servidor AWS
# Executa limpeza de Docker, caches, e logs

echo "🧹 Iniciando limpeza do servidor..."

# Remover imagens dangling (não utilizadas)
echo "🗑️ Removendo imagens Docker não utilizadas..."
docker image prune -a --force 2>/dev/null || true

# Remover containers parados
echo "🗑️ Removendo containers parados..."
docker container prune --force 2>/dev/null || true

# Remover volumes não utilizados
echo "🗑️ Removendo volumes não utilizados..."
docker volume prune --force 2>/dev/null || true

# Limpar cache do Docker builder
echo "🗑️ Limpando cache do Docker builder..."
docker builder prune --all --force 2>/dev/null || true

# Remover arquivos temporários
echo "🗑️ Limpando arquivos temporários..."
rm -rf /tmp/* 2>/dev/null || true
rm -rf /var/tmp/* 2>/dev/null || true

# Limpar logs antigos (mais de 7 dias)
echo "🗑️ Limpando logs antigos..."
find /var/log -type f -name "*.log" -mtime +7 -delete 2>/dev/null || true
journalctl --vacuum=7d 2>/dev/null || true

# Verificar espaço disponível
echo ""
echo "📊 Espaço em disco após limpeza:"
df -h /

echo ""
echo "✅ Limpeza concluída!"
