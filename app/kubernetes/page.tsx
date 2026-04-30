'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Server, Layers, Shield, Network, Package, Terminal, Database, Activity } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

export default function KubernetesPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/kubernetes');
  }, [trackPageVisit]);

  const items = [
    { id: 'k8s-instalado',  label: 'K3s instalado e kubectl funcionando — cluster single-node UP com node Ready e pods do sistema Running' },
    { id: 'k8s-deploy',     label: 'Deployment Nginx criado, escalado para 3 réplicas e exposto via Service NodePort — acessível no browser pelo IP do nó' },
    { id: 'k8s-network',    label: 'NetworkPolicy aplicada isolando namespace de produção — tráfego bloqueado conforme regra e Ingress roteando por hostname' },
  ];

  return (
    <main className="module-accent-kubernetes min-h-screen bg-bg text-text">
      {/* Hero */}
      <div className="module-hero border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">☸️</span>
            <span className="section-label">v4.0 · Infraestrutura Moderna</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Kubernetes / K3s</h1>
          <p className="text-text-2 text-lg leading-relaxed max-w-2xl">
            Orquestração de containers do zero ao cluster de produção — com K3s, a distribuição leve que
            roda no seu servidor atual, no Raspberry Pi ou num VPS de $5/mês.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {['K3s', 'kubectl', 'Pod', 'Deployment', 'Service', 'Ingress', 'NetworkPolicy', 'Helm'].map(t => (
              <span key={t} className="font-mono text-xs bg-mod/10 text-mod border border-mod/30 px-3 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* Por que Kubernetes */}
        <section>
          <h2 className="section-title">Por que Kubernetes existe</h2>
          <p className="text-text-2 mb-6 leading-relaxed">
            Com Docker você tem um container. Com Docker Compose você tem uma stack. Com Kubernetes você
            tem uma <strong>plataforma</strong> — que reinicia containers que morrem, distribui carga,
            faz deploy sem downtime e escala automaticamente.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-bg-2 border border-border rounded-xl p-5">
              <h3 className="font-bold mb-3 text-warn">❌ Sem Kubernetes</h3>
              <ul className="text-sm text-text-2 space-y-2">
                <li>• Container crash → app fica offline até alguém perceber</li>
                <li>• Deploy = downtime (parar container, subir novo)</li>
                <li>• Escalar = editar docker-compose.yml manualmente</li>
                <li>• 1 servidor = 1 ponto de falha</li>
                <li>• Configuração espalhada em vários servidores</li>
              </ul>
            </div>
            <div className="bg-bg-2 border border-border rounded-xl p-5">
              <h3 className="font-bold mb-3 text-ok">✅ Com Kubernetes</h3>
              <ul className="text-sm text-text-2 space-y-2">
                <li>• Container crash → reinicia automaticamente em segundos</li>
                <li>• Rolling update: 0 downtime — troca pods gradualmente</li>
                <li>• HPA: escala réplicas com base em CPU/memória</li>
                <li>• Multi-node: falha de 1 nó não derruba a app</li>
                <li>• Estado declarativo: um YAML descreve o cluster inteiro</li>
              </ul>
            </div>
          </div>

          {/* K3s vs K8s */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-2">
                  <th className="text-left p-4 font-mono text-text-2">Critério</th>
                  <th className="text-left p-4 font-bold text-mod">K3s</th>
                  <th className="text-left p-4 text-text-2">K8s (kubeadm)</th>
                  <th className="text-left p-4 text-text-2">minikube/kind</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['RAM mínima',       '512 MB',           '2 GB por nó',        '2 GB'],
                  ['Instalação',       '1 comando curl',   'kubeadm + etcd + CRI','1 comando'],
                  ['Container Runtime','containerd built-in','CRI-O/containerd',  'Docker/containerd'],
                  ['CNI padrão',       'Flannel',          'nenhum (escolher)',   'kindnet/bridge'],
                  ['Ingress padrão',   'Traefik',          'nenhum (escolher)',   'nenhum'],
                  ['Load Balancer',    'Klipper LB',       'nenhum (escolher)',   'nenhum'],
                  ['Indicado para',    'prod em edge/VPS', 'prod enterprise',     'dev local'],
                ].map(([c, k3, k8, mk]) => (
                  <tr key={c} className="border-b border-border/50 hover:bg-bg-2/50">
                    <td className="p-4 font-mono text-text-2 text-xs">{c}</td>
                    <td className="p-4 text-ok font-semibold text-sm">{k3}</td>
                    <td className="p-4 text-text-2 text-sm">{k8}</td>
                    <td className="p-4 text-text-2 text-sm">{mk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Conceitos Fundamentais */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Layers size={22} /> Conceitos Fundamentais</h2>
          <p className="text-text-2 mb-6 leading-relaxed">
            Kubernetes tem muitos objetos, mas o dia a dia de um SysAdmin gira em torno de menos de 10.
            Entendendo estes, você cobre 90% dos cenários reais.
          </p>

          <div className="space-y-3">
            {[
              { obj: 'Pod', emoji: '📦', desc: 'Menor unidade deployável. 1 ou mais containers compartilhando rede e storage. Efêmero — quando morre, não volta.', analogy: 'Como um processo no SO — pode morrer a qualquer momento' },
              { obj: 'Deployment', emoji: '🔄', desc: 'Garante que N réplicas de um Pod estejam sempre rodando. Gerencia rolling updates e rollbacks automaticamente.', analogy: 'Como um serviço systemd com restart=always + N instâncias' },
              { obj: 'Service', emoji: '🌐', desc: 'IP/DNS estável para acessar um conjunto de Pods. Faz load balancing entre réplicas. Os Pods têm IPs que mudam — o Service não.', analogy: 'Como um proxy reverso interno com descoberta de serviço automática' },
              { obj: 'Ingress', emoji: '🚪', desc: 'Roteamento HTTP/HTTPS por hostname ou path. Um único IP externo serve múltiplos serviços. Requer um Ingress Controller (Traefik/Nginx).', analogy: 'Como um virtual host do Nginx, mas declarado em YAML' },
              { obj: 'ConfigMap', emoji: '📋', desc: 'Armazena configuração não-sensível (env vars, arquivos de config). Desacopla config do código da imagem.', analogy: 'Como variáveis de ambiente no docker-compose.yml' },
              { obj: 'Secret', emoji: '🔐', desc: 'ConfigMap para dados sensíveis (senhas, tokens, certs). Armazenado em base64 (não criptografado por padrão — cuidado!).', analogy: 'Como o .env file, mas gerenciado pelo cluster' },
              { obj: 'Namespace', emoji: '🏠', desc: 'Isolamento lógico dentro do cluster. Separa ambientes (prod/staging/dev) ou times. NetworkPolicy age por namespace.', analogy: 'Como diferentes VLANs ou zonas de rede' },
              { obj: 'PersistentVolume', emoji: '💾', desc: 'Armazenamento persistente que sobrevive ao Pod. PV=disco real, PVC=requisição de armazenamento feita pelo app.', analogy: 'Como um volume Docker nomeado, mas com lifecycle independente' },
            ].map(item => (
              <div key={item.obj} className="flex gap-4 bg-bg-2 border border-border rounded-xl p-4 hover:border-mod/30 transition-colors">
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono font-bold text-mod">{item.obj}</span>
                    <span className="text-xs text-text-3 italic">{item.analogy}</span>
                  </div>
                  <p className="text-sm text-text-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Instalação K3s */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Terminal size={22} /> Instalando K3s</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            K3s instala em menos de 30 segundos. Um único binário inclui: API server, scheduler,
            controller manager, kubelet, kube-proxy, containerd e Traefik.
          </p>

          <CodeBlock lang="bash" code={`# Pré-requisitos mínimos: Ubuntu 20.04+, 512 MB RAM, 1 CPU

# Instalação single-node (control plane + worker na mesma máquina)
curl -sfL https://get.k3s.io | sh -

# Com opções customizadas:
curl -sfL https://get.k3s.io | sh -s - \\
  --disable traefik \\          # se quiser usar Nginx Ingress
  --write-kubeconfig-mode 644 \\ # permite ler kubeconfig sem sudo
  --node-name "meu-servidor"

# Verificar status do serviço
sudo systemctl status k3s

# Verificar nó
sudo kubectl get nodes
# NAME          STATUS   ROLES                  AGE   VERSION
# meu-servidor  Ready    control-plane,master   30s   v1.29.x+k3s1

# Configurar kubectl sem sudo (kubeconfig)
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config
export KUBECONFIG=~/.kube/config

# Verificar todos os pods do sistema
kubectl get pods -A
# NAMESPACE     NAME                           READY   STATUS
# kube-system   coredns-xxx                    1/1     Running
# kube-system   local-path-provisioner-xxx     1/1     Running
# kube-system   traefik-xxx                    1/1     Running`} />

          <InfoBox title="K3s em cluster multi-nó">
            <p>Para adicionar nós worker ao cluster, rode no nó master:
            <code className="mx-1">sudo cat /var/lib/rancher/k3s/server/node-token</code> para obter o token.
            Depois no worker:
            <code className="mx-1">curl -sfL https://get.k3s.io | K3S_URL=https://IP-MASTER:6443 K3S_TOKEN=TOKEN sh -</code></p>
          </InfoBox>
        </section>

        {/* kubectl */}
        <section>
          <h2 className="section-title">kubectl — O CLI do Kubernetes</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            <code>kubectl</code> é a ferramenta de linha de comando para interagir com o cluster.
            Assim como o <code>docker</code> CLI para Docker, o <code>kubectl</code> é para Kubernetes.
          </p>

          <CodeBlock lang="bash" code={`# ── Listar recursos ──────────────────────────────────────────

kubectl get pods                        # pods no namespace padrão
kubectl get pods -n kube-system         # pods no namespace kube-system
kubectl get pods -A                     # todos os namespaces
kubectl get pods -o wide                # mostra IP e nó
kubectl get all                         # pods, services, deployments...

kubectl get nodes                       # nós do cluster
kubectl get services                    # services (svc)
kubectl get deployments                 # deployments (deploy)
kubectl get ingress                     # ingress rules
kubectl get namespaces                  # namespaces (ns)

# ── Inspecionar ──────────────────────────────────────────────

kubectl describe pod <nome>             # detalhes completos do pod
kubectl describe node <nome>            # status do nó (CPU/RAM)
kubectl logs <pod>                      # stdout do container
kubectl logs <pod> -f                   # seguir logs em tempo real
kubectl logs <pod> -c <container>       # multi-container pod

# ── Executar comandos ─────────────────────────────────────────

kubectl exec -it <pod> -- bash          # shell interativo
kubectl exec <pod> -- curl http://svc   # comando direto

# ── Aplicar / Deletar manifestos ─────────────────────────────

kubectl apply -f manifesto.yaml         # criar ou atualizar
kubectl delete -f manifesto.yaml        # deletar o que está no arquivo
kubectl delete pod <nome>               # deletar pod específico

# ── Escalar / Rollout ─────────────────────────────────────────

kubectl scale deployment nginx --replicas=5
kubectl rollout status deployment/nginx  # acompanhar deploy
kubectl rollout history deployment/nginx # histórico de versões
kubectl rollout undo deployment/nginx    # reverter para versão anterior

# ── Dicas de produtividade ────────────────────────────────────

alias k=kubectl                          # economiza muita digitação
kubectl get pods --watch                 # monitorar mudanças em tempo real
kubectl explain deployment.spec          # documentação inline de qualquer campo`} />
        </section>

        {/* Manifestos YAML */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Package size={22} /> Manifestos YAML — Infraestrutura Declarativa</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            No Kubernetes, você descreve o estado desejado em YAML e o cluster trabalha continuamente
            para atingi-lo. Não "execute este comando", mas "garanta que este estado exista".
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-bold mb-2 text-text-2">deployment.yaml</p>
              <CodeBlock lang="yaml" code={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: producao
  labels:
    app: nginx
spec:
  replicas: 3            # sempre 3 Pods
  selector:
    matchLabels:
      app: nginx         # seleciona Pods com este label
  strategy:
    type: RollingUpdate  # 0 downtime
    rollingUpdate:
      maxUnavailable: 1  # 1 pod pode estar offline
      maxSurge: 1        # 1 pod extra durante update
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.25-alpine
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: "64Mi"
              cpu: "100m"   # 0.1 CPU
            limits:
              memory: "128Mi"
              cpu: "250m"
          readinessProbe:   # só recebe tráfego quando pronto
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10`} />
            </div>
            <div>
              <p className="text-sm font-bold mb-2 text-text-2">service.yaml</p>
              <CodeBlock lang="yaml" code={`apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
  namespace: producao
spec:
  selector:
    app: nginx     # aponta para Pods com este label
  ports:
    - port: 80         # porta do Service
      targetPort: 80   # porta do container
  type: ClusterIP   # só acessível dentro do cluster
---
# NodePort — expõe no IP do nó
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
  namespace: producao
spec:
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080  # porta no nó (30000-32767)
  type: NodePort
# Acesso: http://IP-DO-NO:30080`} />
              <p className="text-sm font-bold mb-2 mt-4 text-text-2">namespace.yaml</p>
              <CodeBlock lang="yaml" code={`apiVersion: v1
kind: Namespace
metadata:
  name: producao
  labels:
    env: producao
---
apiVersion: v1
kind: Namespace
metadata:
  name: staging
  labels:
    env: staging`} />
            </div>
          </div>

          <CodeBlock lang="bash" code={`# Aplicar todos os manifestos de uma pasta
kubectl apply -f ./manifests/

# Criar namespace antes dos outros recursos
kubectl apply -f namespace.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Verificar estado final
kubectl get all -n producao
# NAME                         READY   STATUS    RESTARTS   AGE
# pod/nginx-xxx-aaa            1/1     Running   0          30s
# pod/nginx-xxx-bbb            1/1     Running   0          30s
# pod/nginx-xxx-ccc            1/1     Running   0          30s
#
# NAME                  TYPE       CLUSTER-IP     PORT(S)
# service/nginx-svc     ClusterIP  10.43.x.x      80/TCP
# service/nginx-np      NodePort   10.43.x.y      80:30080/TCP
#
# NAME                    READY   UP-TO-DATE   AVAILABLE
# deployment.apps/nginx   3/3     3            3`} />
        </section>

        {/* ConfigMap e Secret */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Database size={22} /> ConfigMap e Secret</h2>

          <CodeBlock lang="yaml" code={`# configmap.yaml — configuração não-sensível
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: producao
data:
  APP_ENV: "producao"
  LOG_LEVEL: "info"
  DB_HOST: "postgres-svc.producao.svc.cluster.local"
  nginx.conf: |
    server {
      listen 80;
      location /health { return 200 "ok"; }
    }
---
# secret.yaml — dados sensíveis (base64)
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
  namespace: producao
type: Opaque
data:
  # echo -n "minha-senha" | base64
  DB_PASSWORD: bWluaGEtc2VuaGE=
  API_KEY: c2stYWJjMTIz
---
# Usar no Deployment
spec:
  containers:
    - name: app
      image: minha-app:1.0
      env:
        # Variável individual do ConfigMap
        - name: APP_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: APP_ENV
        # Todas as chaves do Secret como env vars
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: DB_PASSWORD
      # Montar ConfigMap como arquivo
      volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/conf.d/
  volumes:
    - name: nginx-config
      configMap:
        name: app-config
        items:
          - key: nginx.conf
            path: default.conf`} />

          <CodeBlock lang="bash" code={`# Criar Secret diretamente (sem YAML — evita base64 manual)
kubectl create secret generic app-secret \\
  --from-literal=DB_PASSWORD="minha-senha" \\
  --from-literal=API_KEY="sk-abc123" \\
  -n producao

# Criar Secret de imagem privada (Docker registry)
kubectl create secret docker-registry registry-secret \\
  --docker-server=registry.empresa.com \\
  --docker-username=usuario \\
  --docker-password=senha \\
  -n producao

# Criar ConfigMap de arquivo existente
kubectl create configmap nginx-config \\
  --from-file=nginx.conf \\
  -n producao`} />

          <WarnBox title="Secrets não são criptografados por padrão">
            <p>Secrets no Kubernetes são apenas base64 — qualquer pessoa com acesso ao cluster pode decodificar.
            Para produção real, use <strong>Sealed Secrets</strong> (controller + kubeseal) ou integre com
            um cofre externo (HashiCorp Vault, AWS Secrets Manager).</p>
          </WarnBox>
        </section>

        {/* Ingress */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Network size={22} /> Ingress — Roteamento HTTP/HTTPS</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            O Ingress centraliza o roteamento externo. K3s já vem com Traefik como Ingress Controller —
            a mesma ferramenta que estudamos no Sprint I.11, agora gerenciada pelo Kubernetes.
          </p>

          <CodeBlock lang="yaml" code={`# ingress.yaml — Traefik (K3s padrão)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: producao
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
    cert-manager.io/cluster-issuer: letsencrypt-prod  # ACME automático
spec:
  ingressClassName: traefik
  tls:
    - hosts:
        - app.empresa.com
        - api.empresa.com
      secretName: app-tls-secret   # cert-manager popula automaticamente
  rules:
    # Frontend
    - host: app.empresa.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80
    # API
    - host: api.empresa.com
      http:
        paths:
          - path: /v1
            pathType: Prefix
            backend:
              service:
                name: api-svc
                port:
                  number: 8080
          - path: /health
            pathType: Exact
            backend:
              service:
                name: api-svc
                port:
                  number: 8080`} />

          <CodeBlock lang="bash" code={`# Verificar Ingress
kubectl get ingress -n producao
# NAME          CLASS    HOSTS                          ADDRESS       PORTS
# app-ingress   traefik  app.empresa.com,api.empresa.com 192.168.1.10  80,443

# Instalar cert-manager para HTTPS automático (Let's Encrypt)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml

# Criar ClusterIssuer para Let's Encrypt
cat <<'EOF' | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@empresa.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: traefik
EOF`} />
        </section>

        {/* NetworkPolicy */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Shield size={22} /> NetworkPolicy — Firewall Nativo do Kubernetes</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Por padrão, todo Pod pode se comunicar com todo Pod no cluster. NetworkPolicy muda isso —
            é o equivalente das regras iptables, mas declarado em YAML e gerenciado pelo CNI.
          </p>

          <CodeBlock lang="yaml" code={`# networkpolicy.yaml — isolamento do namespace de produção
---
# 1. Bloquear TODO o tráfego de entrada por padrão
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: producao
spec:
  podSelector: {}     # aplica a TODOS os pods do namespace
  policyTypes:
    - Ingress          # bloqueia tráfego de entrada
---
# 2. Permitir apenas o Ingress Controller acessar o frontend
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-to-frontend
  namespace: producao
spec:
  podSelector:
    matchLabels:
      app: frontend    # aplica apenas ao frontend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system  # traefik namespace
      ports:
        - protocol: TCP
          port: 80
---
# 3. Frontend pode acessar a API, mas API NÃO pode iniciar conexão com frontend
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
  namespace: producao
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend   # apenas pods com label app=frontend
      ports:
        - protocol: TCP
          port: 8080
---
# 4. API pode acessar banco de dados — banco não aceita mais ninguém
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-db
  namespace: producao
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: api
      ports:
        - protocol: TCP
          port: 5432`} />

          <InfoBox title="NetworkPolicy precisa de CNI compatível">
            <p>NetworkPolicy só funciona se o CNI (Container Network Interface) implementa a API.
            K3s usa <strong>Flannel</strong> por padrão, mas Flannel <strong>não suporta NetworkPolicy</strong>.
            Para usar NetworkPolicy com K3s, instale com <code>--flannel-backend=none</code> e adicione
            <strong>Calico</strong> ou <strong>Cilium</strong>:
            <code className="block mt-2 text-xs">curl -sfL https://get.k3s.io | sh -s - --flannel-backend=none --disable-network-policy</code>
            <code className="block text-xs">kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.0/manifests/calico.yaml</code>
            </p>
          </InfoBox>
        </section>

        {/* Persistent Volumes */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Database size={22} /> Persistent Volumes — Dados que Sobrevivem ao Pod</h2>

          <CodeBlock lang="yaml" code={`# K3s inclui um provisionador automático (local-path)
# PVCs são satisfeitos automaticamente sem criar PV manualmente

# pvc.yaml — solicitar armazenamento
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: producao
spec:
  accessModes:
    - ReadWriteOnce     # 1 nó por vez (disco local)
  storageClassName: local-path  # provisionador do K3s
  resources:
    requests:
      storage: 10Gi    # 10 gigabytes
---
# Usar o PVC no Deployment do PostgreSQL
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: producao
spec:
  replicas: 1          # bancos relacionais: 1 réplica (use StatefulSet para HA)
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secret
                  key: DB_PASSWORD
            - name: PGDATA
              value: /var/lib/postgresql/data/pgdata
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: postgres-pvc   # referenciar o PVC criado acima`} />

          <CodeBlock lang="bash" code={`# Verificar PVC e PV criados automaticamente
kubectl get pvc -n producao
# NAME           STATUS   VOLUME        CAPACITY   ACCESS MODES
# postgres-pvc   Bound    pvc-xxx-yyy   10Gi       RWO

kubectl get pv
# Os dados ficam em: /var/lib/rancher/k3s/storage/<pvc-name>/`} />
        </section>

        {/* Helm */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Package size={22} /> Helm — O Gerenciador de Pacotes do Kubernetes</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Helm é para Kubernetes o que <code>apt</code> é para o Linux. Um <strong>chart</strong> Helm
            empacota todos os manifestos de uma aplicação com valores configuráveis.
          </p>

          <CodeBlock lang="bash" code={`# Instalar Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version

# Adicionar repositório de charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Pesquisar charts disponíveis
helm search repo prometheus
helm search hub wordpress

# Instalar chart com valores padrão
helm install prometheus prometheus-community/kube-prometheus-stack \\
  --namespace monitoring \\
  --create-namespace

# Customizar valores antes de instalar
helm show values prometheus-community/kube-prometheus-stack > values.yaml
# editar values.yaml...
helm install prometheus prometheus-community/kube-prometheus-stack \\
  --namespace monitoring \\
  -f values.yaml

# Atualizar release existente
helm upgrade prometheus prometheus-community/kube-prometheus-stack \\
  --namespace monitoring \\
  -f values.yaml

# Listar releases instalados
helm list -A

# Rollback para versão anterior
helm rollback prometheus 1 --namespace monitoring

# Remover release
helm uninstall prometheus --namespace monitoring`} />
        </section>

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: Deploy no Kubernetes"
          steps={[
            { label: 'Namespace', sub: 'isolamento lógico do ambiente', icon: <Layers size={14} />, color: 'border-info/50' },
            { label: 'Deployment', sub: 'N réplicas do Pod + rolling update', icon: <Activity size={14} />, color: 'border-ok/50' },
            { label: 'Service', sub: 'IP estável + load balancing interno', icon: <Network size={14} />, color: 'border-mod/50' },
            { label: 'ConfigMap/Secret', sub: 'config desacoplada do código', icon: <Database size={14} />, color: 'border-warn/50' },
            { label: 'Ingress', sub: 'roteamento HTTP/HTTPS por hostname', icon: <Server size={14} />, color: 'border-info/50' },
            { label: 'NetworkPolicy', sub: 'firewall entre pods e namespaces', icon: <Shield size={14} />, color: 'border-err/50' },
          ]}
        />

        {/* WindowsComparisonBox */}
        <WindowsComparisonBox
          windowsLabel="Windows / IIS / AKS"
          linuxLabel="Kubernetes / K3s"
          windowsCode={`# Windows Server — deploy manual
# Instalar IIS em cada servidor
Install-WindowsFeature Web-Server

# Windows Containers (Docker no Windows)
docker run -d mcr.microsoft.com/windows/servercore/iis

# AKS — Azure Kubernetes Service
# Cluster gerenciado na Azure
az aks create --name meu-cluster \\
  --resource-group meu-rg \\
  --node-count 3

# Service Fabric
# Orquestrador Microsoft para microservices
# Mais complexo que Kubernetes

# Scaling manual ou via Azure autoscale
# Failover: configuração do Windows Server Failover`}
          linuxCode={`# K3s — 1 comando, qualquer VPS/bare-metal
curl -sfL https://get.k3s.io | sh -

# Deploy declarativo
kubectl apply -f deployment.yaml

# Scaling em 1 linha
kubectl scale deploy nginx --replicas=10

# Rolling update automático (0 downtime)
kubectl set image deploy/nginx nginx=nginx:1.26

# Rollback imediato se algo quebrar
kubectl rollout undo deploy/nginx

# Self-healing automático
# Pod crash → Kubernetes reinicia em segundos
# Nó falha → Pods migram para outros nós

# Multi-cloud: mesmo YAML roda em
# AWS EKS, GCP GKE, Azure AKS, bare-metal`}
        />

        {/* Exercícios Guiados */}
        <section>
          <h2 className="section-title">Exercícios Guiados</h2>
          <div className="space-y-6">

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
                <h3 className="font-bold">Instalar K3s e fazer o primeiro deploy</h3>
              </div>
              <CodeBlock lang="bash" code={`# 1. Instalar K3s
curl -sfL https://get.k3s.io | sh -

# 2. Configurar kubeconfig
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config

# 3. Verificar cluster
kubectl get nodes
kubectl get pods -A

# 4. Criar namespace de teste
kubectl create namespace lab

# 5. Fazer primeiro deploy
kubectl create deployment nginx --image=nginx:alpine -n lab
kubectl scale deployment nginx --replicas=3 -n lab

# 6. Expor via NodePort
kubectl expose deployment nginx --port=80 --type=NodePort -n lab

# 7. Descobrir porta e testar
PORT=$(kubectl get svc nginx -n lab -o jsonpath='{.spec.ports[0].nodePort}')
curl http://localhost:$PORT

# 8. Ver pods e distribuição
kubectl get pods -n lab -o wide`} />
            </div>

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
                <h3 className="font-bold">Deploy com ConfigMap + Secret + PVC</h3>
              </div>
              <CodeBlock lang="bash" code={`# 1. Criar namespace de produção
kubectl create namespace producao

# 2. Criar Secret para o banco
kubectl create secret generic db-secret \\
  --from-literal=POSTGRES_PASSWORD="senha-super-secreta" \\
  -n producao

# 3. Criar PVC para persistência
cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: producao
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: local-path
  resources:
    requests:
      storage: 1Gi
EOF

# 4. Deploy PostgreSQL com PVC + Secret
cat <<'EOF' | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: producao
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: POSTGRES_PASSWORD
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: postgres-pvc
EOF

# 5. Verificar
kubectl get pods,pvc -n producao
kubectl logs deploy/postgres -n producao | tail -5`} />
            </div>

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">3</span>
                <h3 className="font-bold">Rolling update e rollback</h3>
              </div>
              <CodeBlock lang="bash" code={`# 1. Deploy inicial com versão 1.25
kubectl create deployment webapp --image=nginx:1.25-alpine -n lab
kubectl scale deployment webapp --replicas=3 -n lab

# 2. Acompanhar pods em outro terminal
# kubectl get pods -n lab --watch

# 3. Fazer rolling update para versão 1.26 (0 downtime)
kubectl set image deployment/webapp nginx=nginx:1.26-alpine -n lab

# 4. Acompanhar o rollout
kubectl rollout status deployment/webapp -n lab
# Waiting for deployment "webapp" rollout to finish...
# 1 out of 3 new replicas have been updated...
# 2 out of 3 new replicas have been updated...
# deployment "webapp" successfully rolled out

# 5. Simular versão quebrada
kubectl set image deployment/webapp nginx=nginx:versao-que-nao-existe -n lab

# 6. Ver pods falhando
kubectl get pods -n lab  # ImagePullBackOff em novos pods, antigos ainda Up

# 7. Rollback imediato
kubectl rollout undo deployment/webapp -n lab

# 8. Verificar histórico
kubectl rollout history deployment/webapp -n lab

# 9. Voltar para revisão específica
kubectl rollout undo deployment/webapp --to-revision=1 -n lab`} />
            </div>
          </div>
        </section>

        {/* Erros Comuns */}
        <section>
          <h2 className="section-title">Erros Comuns e Soluções</h2>
          <div className="space-y-4">
            {[
              {
                err: 'Pod em CrashLoopBackOff',
                fix: 'kubectl logs <pod> -n <ns> para ver o erro. Geralmente: aplicação não inicializa (config errada, DB inacessível, porta em uso). kubectl describe pod <pod> mostra eventos de restart.',
              },
              {
                err: 'Pod em ImagePullBackOff ou ErrImagePull',
                fix: 'Imagem não encontrada ou registro privado sem credenciais. Verificar nome/tag da imagem. Para registro privado: kubectl create secret docker-registry e adicionar imagePullSecrets no spec do Pod.',
              },
              {
                err: 'Service não encontra os Pods (Endpoints vazio)',
                fix: 'O selector do Service não bate com os labels dos Pods. Verificar: kubectl describe svc <nome> | grep Selector e kubectl get pods --show-labels. Os labels devem ser idênticos.',
              },
              {
                err: 'PVC em Pending (não liga no PV)',
                fix: 'Com K3s, verificar se o provisionador local-path está rodando: kubectl get pods -n kube-system | grep local-path. Se o storageClassName não existir, listar: kubectl get storageclass.',
              },
            ].map(({ err, fix }) => (
              <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
                <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
                <p className="text-sm text-text-2">✅ {fix}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section className="bg-bg-2 border border-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={22} className="text-mod" />
            <h2 className="text-xl font-bold">Checklist do Lab</h2>
          </div>
          <div className="space-y-3">
            {items.map(item => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[var(--mod)]"
                />
                <span className={`text-sm leading-relaxed transition-colors ${checklist[item.id] ? 'line-through text-text-3' : 'text-text-2 group-hover:text-text'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          {items.every(i => checklist[i.id]) && (
            <div className="mt-6 p-4 bg-ok/10 border border-ok/30 rounded-xl text-ok text-sm font-medium">
              ☸️ Kubernetes Master — orquestração de containers dominada!
            </div>
          )}
        </section>

        <ModuleNav currentPath="/kubernetes" order={ADVANCED_ORDER} />
      </div>
    </main>
  );
}
