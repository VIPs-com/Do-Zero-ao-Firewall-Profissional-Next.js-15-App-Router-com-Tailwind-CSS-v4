#!/bin/bash
# entrar.sh — Port Knocking automático + conexão SSH
# Uso: ./entrar.sh [IP_DO_FIREWALL]
# Adapte as portas e o usuário SSH conforme seu laboratório

FIREWALL="${1:-IP-DO-FIREWALL}"
USUARIO="admin"

# Portas da sequência de knock (deve coincidir com as regras iptables)
PORTA1=1000
PORTA2=2000

echo "🚪 Iniciando sequência de Port Knocking..."
echo "   Alvo: ${FIREWALL}"
echo ""

# Batida 1
echo "   [1/2] Batendo na porta ${PORTA1}..."
nmap -p "${PORTA1}" "${FIREWALL}" > /dev/null 2>&1
sleep 0.5

# Batida 2
echo "   [2/2] Batendo na porta ${PORTA2}..."
nmap -p "${PORTA2}" "${FIREWALL}" > /dev/null 2>&1
sleep 0.5

echo ""
echo "🔑 Batidas enviadas! Conectando SSH em 1 segundo..."
sleep 1

ssh "${USUARIO}@${FIREWALL}"
