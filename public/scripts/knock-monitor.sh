#!/bin/bash
# knock-monitor.sh — Monitora as listas do módulo xt_recent em tempo real
# Execute no servidor Firewall para ver quem está batendo nas portas
# Atualiza a cada 1 segundo

LISTAS="${1:-FASE1 FASE2}"

# Verificar se o diretório existe
if [ ! -d /proc/net/xt_recent ]; then
    echo "ERRO: /proc/net/xt_recent não encontrado."
    echo "O módulo xt_recent está carregado? (modprobe xt_recent)"
    exit 1
fi

echo "Monitorando Port Knocking (Ctrl+C para sair)..."
echo ""

watch -n 1 "
    for lista in ${LISTAS}; do
        echo \"=== Lista: \$lista ===\"
        if [ -f /proc/net/xt_recent/\$lista ]; then
            cat /proc/net/xt_recent/\$lista || echo '(vazia)'
        else
            echo '(lista não existe ainda)'
        fi
        echo ''
    done
    echo \"Timestamp: \$(date '+%H:%M:%S')\"
"
