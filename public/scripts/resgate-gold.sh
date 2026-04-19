#!/bin/bash
# ============================================================
# RESGATE GOLD — Botão de Pânico do Workshop Linux
# Restaura o firewall para um estado estável e seguro
#
# Uso:  sudo bash resgate-gold.sh
#       curl -s http://SEU-IP/scripts/resgate-gold.sh | sudo bash
#
# O que este script FAZ:
#   1. Limpa TODAS as regras iptables existentes
#   2. Define políticas padrão seguras (INPUT/FORWARD = DROP)
#   3. Garante acesso SSH (porta 22) para você não ficar trancado
#   4. Permite tráfego ESTABLISHED (respostas de conexões abertas)
#   5. Ativa o ip_forward para roteamento entre interfaces
#   6. Salva um backup do estado atual
#
# O que este script NÃO FAZ:
#   - Não configura NAT, DNAT nem Port Knocking
#   - Não instala nem remove pacotes
#   - Não modifica arquivos de configuração
# ============================================================

set -e

# Verificar se está rodando como root
if [ "$(id -u)" -ne 0 ]; then
  echo "❌ Este script precisa ser executado como root (sudo)."
  exit 1
fi

echo ""
echo "🆘 RESGATE GOLD — Modo de Recuperação Ativado"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Limpar todas as regras existentes
echo "🧹 Limpando regras existentes..."
iptables -F
iptables -t nat -F
iptables -t mangle -F
iptables -X 2>/dev/null || true   # ignora erro se não há chains customizadas
echo "   ✓ Regras limpas"

# 2. Resetar políticas padrão
echo "⚙️  Resetando políticas padrão..."
iptables -P INPUT   DROP
iptables -P FORWARD DROP
iptables -P OUTPUT  ACCEPT
echo "   ✓ INPUT=DROP | FORWARD=DROP | OUTPUT=ACCEPT"

# 3. Regras base de sobrevivência
echo "🛡️  Aplicando regras base..."

# Loopback (essencial para comunicação interna do sistema)
iptables -A INPUT -i lo -j ACCEPT

# SSH na porta 22 — para você não ficar trancado
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Tráfego de respostas (conexões abertas por você)
iptables -A INPUT   -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT

echo "   ✓ Loopback, SSH (22) e ESTABLISHED liberados"

# 4. Ativar roteamento entre interfaces
echo "🔀 Ativando ip_forward..."
sysctl -w net.ipv4.ip_forward=1 > /dev/null
echo "   ✓ net.ipv4.ip_forward = 1"

# 5. Salvar estado atual como backup de referência
echo "💾 Salvando backup..."
mkdir -p /etc/firewall
BACKUP_FILE="/etc/firewall/resgate-gold-$(date +%Y%m%d-%H%M%S).ipt"
iptables-save > "$BACKUP_FILE"
# Manter somente os 5 backups mais recentes
ls -t /etc/firewall/resgate-gold-*.ipt 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
echo "   ✓ Backup salvo em $BACKUP_FILE"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ RESGATE CONCLUÍDO — Estado estável restaurado"
echo ""
echo "📋 Resumo do que foi feito:"
echo "   • Todas as regras iptables limpas"
echo "   • Políticas: INPUT=DROP | FORWARD=DROP | OUTPUT=ACCEPT"
echo "   • SSH porta 22 liberado (você não vai perder acesso)"
echo "   • Tráfego ESTABLISHED/RELATED liberado"
echo "   • ip_forward ativado"
echo "   • Backup salvo em /etc/firewall/"
echo ""
echo "📌 Próximos passos:"
echo "   1. Reconecte via SSH se necessário"
echo "   2. Volte ao módulo /wan-nat para reconfigurar o lab"
echo "   3. Use 'iptables -L -v -n' para verificar as regras atuais"
echo ""
