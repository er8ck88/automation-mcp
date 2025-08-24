#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Documentação e recursos para automação de fluxos
const AUTOMATION_RESOURCES = {
  'n8n-basics': {
    name: 'N8N - Conceitos Básicos',
    description: 'Fundamentos para começar com n8n',
    mimeType: 'text/markdown',
    content: `# N8N - Guia Básico

## O que é o n8n?
O n8n é uma ferramenta de automação de fluxo de trabalho gratuita e de código aberto que permite conectar diferentes serviços e automatizar tarefas repetitivas.

## Conceitos Fundamentais

### Nós (Nodes)
- **Trigger Nodes**: Iniciam o workflow (Webhook, Schedule, Manual)
- **Regular Nodes**: Executam ações (HTTP Request, Email, Database)
- **Output Nodes**: Finalizam ou redirecionam dados

### Conexões
- Os dados fluem de um nó para outro através de conexões
- Cada nó pode ter múltiplas saídas e entradas
- Use expressões para manipular dados entre nós

### Execuções
- **Manual**: Executada pelo usuário
- **Automática**: Baseada em triggers (webhook, schedule, etc.)
- **Test**: Para desenvolvimento e debug

## Melhores Práticas
1. **Nomeação**: Use nomes descritivos para seus nós
2. **Organização**: Agrupe nós relacionados visualmente
3. **Tratamento de Erros**: Sempre considere cenários de falha
4. **Logs**: Use nós de debug para acompanhar o fluxo
5. **Variáveis**: Utilize variáveis para dados reutilizáveis`
  },

  'n8n-nodes': {
    name: 'N8N - Nós Essenciais',
    description: 'Guia dos principais nós do n8n',
    mimeType: 'text/markdown',
    content: `# Nós Essenciais do N8N

## Triggers (Inicializadores)
### Manual Trigger
- Execução manual do workflow
- Ideal para testes e desenvolvimento

### Webhook
- Recebe requisições HTTP
- Útil para integrações com outros sistemas
- Suporta GET, POST, PUT, DELETE

### Schedule Trigger
- Execução baseada em cronograma
- Suporta cron expressions
- Exemplo: \`0 9 * * 1-5\` (9h nos dias úteis)

### Email Trigger (IMAP)
- Monitora caixa de email
- Processa novos emails automaticamente

## Nós de Dados
### HTTP Request
- Faz chamadas para APIs externas
- Suporta autenticação (API Key, OAuth, etc.)
- Headers e body customizáveis

### Set
- Define variáveis e valores
- Útil para preparar dados
- Suporta JSON, strings, números

### IF
- Controle de fluxo condicional
- Compara valores e direciona execução
- Operadores: =, !=, >, <, contains, etc.

### Switch
- Múltiplas condições
- Alternativa ao IF para casos complexos

## Processamento de Dados
### Function
- JavaScript personalizado
- Acesso completo aos dados do item
- Útil para lógicas complexas

### Function Item
- Processa cada item individualmente
- Mais eficiente para grandes volumes

### Code
- Node.js completo
- Permite imports de bibliotecas
- Máxima flexibilidade

## Integrações Populares
### Google Sheets
- Ler/escrever planilhas
- Suporta múltiplas abas
- Autenticação OAuth2

### Slack
- Enviar mensagens
- Criar canais
- Gerenciar usuários

### Email (SMTP)
- Enviar emails
- Anexos suportados
- Templates HTML`
  },

  'flow-patterns': {
    name: 'Padrões de Fluxo',
    description: 'Padrões comuns para automação',
    mimeType: 'text/markdown',
    content: `# Padrões Comuns de Automação

## 1. ETL (Extract, Transform, Load)
\`\`\`
Source → Transform → Destination
\`\`\`
**Exemplo**: API → Process Data → Database

## 2. Fan-out (Distribuição)
\`\`\`
Input → Split → Multiple Outputs
\`\`\`
**Uso**: Enviar dados para múltiplos sistemas

## 3. Fan-in (Agregação)
\`\`\`
Multiple Inputs → Merge → Single Output
\`\`\`
**Uso**: Combinar dados de várias fontes

## 4. Pipeline com Retry
\`\`\`
Process → Error? → Wait → Retry → Success/Fail
\`\`\`
**Uso**: Sistemas externos instáveis

## 5. Conditional Processing
\`\`\`
Input → Condition → Path A or Path B
\`\`\`
**Uso**: Diferentes processamentos baseados em critérios

## 6. Batch Processing
\`\`\`
Collect → Batch → Process Group → Output
\`\`\`
**Uso**: Processar muitos itens de uma vez

## 7. Event-Driven
\`\`\`
Event → Trigger → Process → Notify
\`\`\`
**Uso**: Reação a eventos externos

## Exemplo Prático: Processamento de Pedidos
1. **Trigger**: Webhook recebe pedido
2. **Validate**: Verifica dados obrigatórios
3. **Branch**: IF - cliente novo ou existente?
4. **Process**: Cria/atualiza cliente
5. **Calculate**: Calcula preços e impostos
6. **Store**: Salva no banco de dados
7. **Notify**: Envia confirmação por email
8. **Log**: Registra para auditoria`
  },

  'error-handling': {
    name: 'Tratamento de Erros',
    description: 'Como lidar com falhas em automações',
    mimeType: 'text/markdown',
    content: `# Tratamento de Erros em Automações

## Estratégias de Erro

### 1. Fail Silently
- Continua execução mesmo com erro
- Use quando o erro não é crítico
- Configure "Continue on Fail" no nó

### 2. Stop and Alert
- Para execução imediatamente
- Envia notificação sobre o erro
- Use para erros críticos

### 3. Retry Logic
- Tenta novamente após falha
- Configure delay entre tentativas
- Limite número máximo de tentativas

### 4. Fallback
- Usa alternativa quando falha
- Exemplo: API primária → API secundária

## Implementação no N8N

### Error Trigger
\`\`\`
Workflow Error → Error Trigger → Handle Error
\`\`\`

### Try-Catch Pattern
\`\`\`json
{
  "continueOnFail": true,
  "onError": "continueRegularOutput"
}
\`\`\`

### Conditional Error Handling
\`\`\`
Process → IF (Error?) → Handle Error
                    → Continue Normal
\`\`\`

## Melhores Práticas

1. **Log Everything**: Sempre registre erros
2. **Contexto**: Inclua dados do item que falhou
3. **Notifications**: Alerte administradores
4. **Graceful Degradation**: Continue funcionando parcialmente
5. **Monitoring**: Acompanhe taxas de erro

## Exemplo de Error Handler
\`\`\`javascript
// No Function node
if (error) {
  return {
    json: {
      error: true,
      message: error.message,
      timestamp: new Date(),
      item: $input.all()[0]
    }
  };
}
\`\`\``
  },

  'expressions': {
    name: 'Expressões N8N',
    description: 'Guia de expressões para manipular dados',
    mimeType: 'text/markdown',
    content: `# Expressões no N8N

## Sintaxe Básica
\`\`\`javascript
{{ $json.campo }}           // Acessar campo JSON
{{ $json["campo com espaço"] }}  // Campo com caracteres especiais
{{ $node["Node Name"].json.campo }}  // Dados de nó específico
\`\`\`

## Variáveis Especiais
\`\`\`javascript
$json     // Dados JSON do item atual
$binary   // Dados binários do item
$item     // Item completo (json + binary)
$input    // Todos os itens de entrada
$node     // Dados de nós específicos
$vars     // Variáveis do workflow
$env      // Variáveis de ambiente
\`\`\`

## Manipulação de Strings
\`\`\`javascript
{{ $json.nome.toUpperCase() }}
{{ $json.email.toLowerCase() }}
{{ $json.texto.trim() }}
{{ $json.frase.replace('old', 'new') }}
{{ $json.campo.substring(0, 10) }}
{{ $json.lista.join(', ') }}
\`\`\`

## Números e Matemática
\`\`\`javascript
{{ $json.preco * 1.1 }}           // Aumentar 10%
{{ Math.round($json.valor) }}      // Arredondar
{{ Math.floor($json.num) }}        // Arredondar para baixo
{{ Math.random() }}                // Número aleatório
{{ Number($json.texto) }}          // Converter para número
\`\`\`

## Datas
\`\`\`javascript
{{ new Date() }}                   // Data atual
{{ $json.data.toISOString() }}     // Formato ISO
{{ DateTime.now().toFormat('yyyy-MM-dd') }}  // Luxon formatting
{{ DateTime.fromISO($json.dataISO) }}        // Parse ISO date
\`\`\`

## Arrays e Objetos
\`\`\`javascript
{{ $json.lista.length }}           // Tamanho do array
{{ $json.lista[0] }}               // Primeiro item
{{ $json.lista.slice(0, 5) }}      // Primeiros 5 itens
{{ $json.obj.hasOwnProperty('campo') }}  // Verificar propriedade
{{ Object.keys($json) }}           // Chaves do objeto
\`\`\`

## Condicionais
\`\`\`javascript
{{ $json.status === 'ativo' ? 'Sim' : 'Não' }}
{{ $json.valor > 100 ? 'Alto' : 'Baixo' }}
\`\`\`

## Funções Úteis
\`\`\`javascript
// UUID
{{ $jmespath($json, 'id') || uuid() }}

// Timestamp
{{ Date.now() }}

// Encoding
{{ encodeURIComponent($json.texto) }}
{{ btoa($json.texto) }}  // Base64 encode

// Regex
{{ /\\d+/.test($json.texto) }}  // Contém números?
\`\`\``
  },

  'integrations': {
    name: 'Integrações Populares',
    description: 'Guia de integrações comuns',
    mimeType: 'text/markdown',
    content: `# Integrações Populares

## APIs REST
### Configuração Básica
- **URL**: Endpoint da API
- **Method**: GET, POST, PUT, DELETE
- **Headers**: Content-Type, Authorization
- **Body**: Dados em JSON/XML

### Autenticação
- **API Key**: Header ou query parameter
- **Bearer Token**: Authorization: Bearer {token}
- **OAuth 2.0**: Fluxo completo de autenticação
- **Basic Auth**: Username:password em base64

## Bancos de Dados
### MySQL/PostgreSQL
- **Connection**: Host, port, database, credentials
- **Queries**: SELECT, INSERT, UPDATE, DELETE
- **Parameterized**: Use ? ou $1 para segurança

### MongoDB
- **Connection String**: mongodb://host:port/database
- **Operations**: find, insertOne, updateMany, deleteOne
- **Agregações**: Pipeline para análises complexas

## Mensageria
### Slack
- **Webhook**: URL personalizada para canal
- **Bot Token**: Interação completa com API
- **Formatação**: Markdown e blocos interativos

### Discord
- **Webhook URL**: Para envio simples
- **Bot Token**: Recursos avançados
- **Embeds**: Mensagens ricas com formatação

### Telegram
- **Bot Token**: Criado via @BotFather
- **Chat ID**: Identificador do chat/usuário
- **Comandos**: /start, /help, etc.

## Email
### SMTP (Envio)
- **Host**: smtp.gmail.com, smtp.outlook.com
- **Port**: 587 (TLS), 465 (SSL)
- **Auth**: Username/password ou OAuth

### IMAP (Recebimento)
- **Host**: imap.gmail.com
- **Port**: 993 (SSL)
- **Folders**: INBOX, Sent, etc.

## Armazenamento
### Google Drive
- **Service Account**: Para aplicações
- **OAuth**: Para usuários finais
- **Scopes**: drive, drive.file, drive.readonly

### AWS S3
- **Access Key**: Credenciais programáticas
- **Bucket**: Container de arquivos
- **Regions**: us-east-1, eu-west-1, etc.

## CRM/ERP
### Salesforce
- **Connected App**: Configuração OAuth
- **SOQL**: Query language específica
- **Bulk API**: Para grandes volumes

### HubSpot
- **API Key**: Autenticação simples
- **Scopes**: Permissões específicas
- **Rate Limits**: 100 requests/10s

## Exemplos de Configuração

### HTTP Request para API REST
\`\`\`json
{
  "url": "https://api.exemplo.com/users",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{ $vars.api_token }}"
  },
  "body": {
    "name": "{{ $json.nome }}",
    "email": "{{ $json.email }}"
  }
}
\`\`\`

### Slack Message
\`\`\`json
{
  "text": "Novo pedido #{{ $json.id }}",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Cliente:* {{ $json.cliente }}\\n*Valor:* R$ {{ $json.valor }}"
      }
    }
  ]
}
\`\`\``
  },

  'debugging': {
    name: 'Debug e Troubleshooting',
    description: 'Como debugar workflows',
    mimeType: 'text/markdown',
    content: `# Debug e Troubleshooting

## Ferramentas de Debug

### 1. Execution Log
- Veja dados de entrada e saída de cada nó
- Identifique onde o fluxo falha
- Analise tempos de execução

### 2. Edit Fields
- Use para inspecionar estrutura de dados
- Teste expressões em tempo real
- Visualize arrays e objetos complexos

### 3. Function Node para Logs
\`\`\`javascript
// Log detalhado
console.log('Debug:', JSON.stringify($input.all(), null, 2));

// Log específico
console.log('Campo X:', $json.campo);

// Retornar dados para próximo nó
return $input.all();
\`\`\`

## Problemas Comuns

### Dados Não Chegam
- **Verifique conexões**: Linhas entre nós
- **Execute manualmente**: Teste cada nó isoladamente
- **Confira filtros**: IF nodes podem bloquear fluxo

### Expressões Não Funcionam
- **Sintaxe**: Verifique {{ }} ao redor
- **Caminhos**: Use browser dev tools para ver estrutura
- **Tipos**: String vs Number vs Boolean

### Erros de API
- **Status codes**: 200=OK, 401=Auth, 404=Not Found
- **Headers**: Content-Type correto?
- **Rate limits**: Muito rápido para a API?
- **Payload**: JSON válido?

### Performance Issues
- **Muitos itens**: Use batching
- **Loops infinitos**: Adicione condições de saída
- **Memória**: Processe em chunks menores

## Estratégias de Debug

### 1. Isolar o Problema
1. Execute nós individualmente
2. Use dados de exemplo fixos
3. Simplifique o workflow temporariamente

### 2. Adicionar Logs
\`\`\`javascript
// No início do Function node
const input = $input.all();
console.log('Input received:', input.length, 'items');

// Durante processamento
if (error) {
  console.error('Error processing:', error.message);
  console.error('Item data:', JSON.stringify($json));
}

// No final
console.log('Processing complete, returning:', result);
return result;
\`\`\`

### 3. Validação de Dados
\`\`\`javascript
// Verificar se campo existe
if (!$json.email) {
  throw new Error('Email field is required');
}

// Verificar tipo
if (typeof $json.age !== 'number') {
  throw new Error('Age must be a number');
}

// Verificar formato
if (!/^\\d{4}-\\d{2}-\\d{2}$/.test($json.date)) {
  throw new Error('Date must be in YYYY-MM-DD format');
}
\`\`\`

## Monitoramento Contínuo

### Error Webhook
Configure um webhook para receber notificações de erro:
\`\`\`json
{
  "workflow": "{{ $workflow.name }}",
  "error": "{{ $error.message }}",
  "timestamp": "{{ new Date().toISOString() }}",
  "execution_id": "{{ $execution.id }}"
}
\`\`\`

### Health Checks
Crie workflows para monitorar sistemas:
1. Teste APIs regularmente
2. Verifique conectividade de banco
3. Monitore uso de recursos
4. Alerte sobre falhas

### Logs Estruturados
\`\`\`javascript
const logEntry = {
  level: 'INFO',
  timestamp: new Date().toISOString(),
  workflow: $workflow.name,
  node: $node.name,
  message: 'Processing completed',
  data: {
    itemsProcessed: $input.all().length,
    duration: Date.now() - startTime
  }
};
console.log(JSON.stringify(logEntry));
\`\`\``
  }
};

class AutomationServer {
  constructor() {
    this.server = new Server(
      {
        name: 'automation-helper',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
    
    // Handle errors
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupResourceHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: Object.entries(AUTOMATION_RESOURCES).map(([uri, resource]) => ({
        uri,
        mimeType: resource.mimeType,
        name: resource.name,
        description: resource.description,
      })),
    }));

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      if (!AUTOMATION_RESOURCES[uri]) {
        throw new McpError(ErrorCode.InvalidRequest, `Resource not found: ${uri}`);
      }

      const resource = AUTOMATION_RESOURCES[uri];
      return {
        contents: [
          {
            uri,
            mimeType: resource.mimeType,
            text: resource.content,
          },
        ],
      };
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'generate_workflow_template',
          description: 'Gera template de workflow baseado no tipo especificado',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['etl', 'api_sync', 'email_automation', 'data_processing', 'monitoring'],
                description: 'Tipo de workflow para gerar'
              },
              source: {
                type: 'string',
                description: 'Sistema/API fonte dos dados'
              },
              destination: {
                type: 'string',
                description: 'Sistema/API destino dos dados'
              }
            },
            required: ['type'],
          },
        },
        {
          name: 'debug_expression',
          description: 'Ajuda a debugar e corrigir expressões do n8n',
          inputSchema: {
            type: 'object',
            properties: {
              expression: {
                type: 'string',
                description: 'Expressão do n8n para debugar'
              },
              sample_data: {
                type: 'object',
                description: 'Dados de exemplo para testar a expressão'
              }
            },
            required: ['expression'],
          },
        },
        {
          name: 'suggest_integration',
          description: 'Sugere como integrar dois sistemas específicos',
          inputSchema: {
            type: 'object',
            properties: {
              system_a: {
                type: 'string',
                description: 'Primeiro sistema/serviço'
              },
              system_b: {
                type: 'string',
                description: 'Segundo sistema/serviço'
              },
              use_case: {
                type: 'string',
                description: 'Caso de uso específico'
              }
            },
            required: ['system_a', 'system_b'],
          },
        },
        {
          name: 'optimize_workflow',
          description: 'Analisa e sugere otimizações para um workflow',
          inputSchema: {
            type: 'object',
            properties: {
              workflow_description: {
                type: 'string',
                description: 'Descrição detalhada do workflow atual'
              },
              performance_issues: {
                type: 'string',
                description: 'Problemas de performance identificados'
              },
              data_volume: {
                type: 'string',
                enum: ['low', 'medium', 'high'],
                description: 'Volume de dados processados'
              }
            },
            required: ['workflow_description'],
          },
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate_workflow_template':
            return { content: [{ type: 'text', text: this.generateWorkflowTemplate(args) }] };
          
          case 'debug_expression':
            return { content: [{ type: 'text', text: this.debugExpression(args) }] };
          
          case 'suggest_integration':
            return { content: [{ type: 'text', text: this.suggestIntegration(args) }] };
          
          case 'optimize_workflow':
            return { content: [{ type: 'text', text: this.optimizeWorkflow(args) }] };
          
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${name}`);
        }
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
      }
    });
  }

  generateWorkflowTemplate(args) {
    const templates = {
      etl: `# Template ETL: ${args.source} → ${args.destination}

## Estrutura do Workflow:

1. **Trigger** (Manual Trigger ou Schedule)
   - Para execução controlada ou automática

2. **Extract** (HTTP Request ou Database Node)
   - Source: ${args.source || 'API/Database'}
   - Endpoint/Query para buscar dados

3. **Transform** (Function Node)
\`\`\`javascript
// Transformar dados conforme necessário
const items = $input.all();
return items.map(item => ({
  id: item.json.id,
  name: item.json.nome?.trim(),
  email: item.json.email?.toLowerCase(),
  created_at: new Date().toISOString(),
  // Adicione suas transformações aqui
}));
\`\`\`

4. **Load** (HTTP Request ou Database Node)
   - Destination: ${args.destination || 'Target System'}
   - Método POST/PUT para inserir/atualizar

5. **Log/Notify** (Function + Slack/Email)
   - Registra resultado da operação
   - Notifica em caso de erro`,

      api_sync: `# Template API Sync: ${args.source} ↔ ${args.destination}

## Workflow Bidirecional:

1. **Schedule Trigger** (Execução periódica)
   - Cron: */15 * * * * (a cada 15 min)

2. **Get Last Sync** (HTTP Request)
   - Buscar timestamp da última sincronização

3. **Fetch Changes A→B**
   - Source: ${args.source}
   - Query: WHERE updated_at > last_sync

4. **Process & Validate**
\`\`\`javascript
return $input.all().filter(item => {
  // Validações necessárias
  return item.json.id && item.json.updated_at;
}).map(item => ({
  ...item.json,
  sync_direction: 'A_to_B',
  processed_at: new Date()
}));
\`\`\`

5. **Send to B** (${args.destination})
   - Batch processing se necessário

6. **Update Sync Timestamp**
   - Registrar última sincronização bem-sucedida`,

      email_automation: `# Template Email Automation

## Workflow de Email:

1. **Email Trigger (IMAP)**
   - Monitor: INBOX
   - Filter: Subject contains "keyword"

2. **Parse Email Content**
\`\`\`javascript
const subject = $json.subject;
const body = $json.body;
const from = $json.from.value[0].address;

// Extrair informações relevantes
const orderMatch = body.match(/Order #(\\d+)/);
const orderId = orderMatch ? orderMatch[1] : null;

return [{
  json: {
    from,
    subject,
    orderId,
    parsedAt: new Date()
  }
}];
\`\`\`

3. **IF - Email Type**
   - Condition: orderId exists
   - True: Process Order
   - False: General Response

4. **Process Order Branch**
   - Lookup order in database
   - Generate response

5. **Send Response (SMTP)**
   - To: Original sender
   - Template-based response`,

      data_processing: `# Template Data Processing

## Workflow de Processamento:

1. **HTTP Webhook**
   - Receive data payload
   - Authentication if needed

2. **Validate Input**
\`\`\`javascript
const required = ['id', 'name', 'email'];
const items = $input.all();

return items.filter(item => {
  return required.every(field => 
    item.json[field] && item.json[field].toString().trim()
  );
});
\`\`\`

3. **Enrich Data**
   - External API calls
   - Database lookups
   - Calculations

4. **Split Processing**
   - IF node para diferentes tipos
   - Parallel processing quando possível

5. **Aggregate Results**
   - Merge node para combinar
   - Summary statistics

6. **Store Results**
   - Database insert/update
   - File export if needed`,

      monitoring: `# Template Monitoring

## Health Check Workflow:

1. **Schedule Trigger**
   - Every 5 minutes: */5 * * * *

2. **Check APIs**
\`\`\`javascript
const endpoints = [
  'https://api1.example.com/health',
  'https://api2.example.com/status'
];

const results = [];
for (const url of endpoints) {
  try {
    const response = await fetch(url);
    results.push({
      url,
      status: response.status,
      ok: response.ok,
      timestamp: new Date()
    });
  } catch (error) {
    results.push({
      url,
      error: error.message,
      timestamp: new Date()
    });
  }
}
return results.map(r => ({ json: r }));
\`\`\`

3. **Check Database**
   - Simple SELECT 1 query
   - Measure response time

4. **IF - Any Failures?**
   - Condition: status !== 200 OR error exists

5. **Alert on Failure**
   - Slack notification
   - Email alert
   - Log to monitoring system

6. **Log Success**
   - Simple log entry
   - Update uptime metrics`
    };

    return templates[args.type] || 'Tipo de template não reconhecido';
  }

  debugExpression(args) {
    const { expression, sample_data } = args;
    
    let analysis = `# Debug da Expressão: \`${expression}\`\n\n`;
    
    // Análise básica da sintaxe
    if (!expression.includes('{{') || !expression.includes('}}')) {
      analysis += '⚠️ **Problema**: Expressão deve estar entre {{ }}\n';
      analysis += `✅ **Correção**: \`{{ ${expression} }}\`\n\n`;
    }
    
    // Identificar variáveis comuns
    const variables = {
      '$json': 'Dados JSON do item atual',
      '$input': 'Todos os itens de entrada',
      '$node': 'Dados de nó específico',
      '$vars': 'Variáveis do workflow',
      '$env': 'Variáveis de ambiente'
    };
    
    analysis += '## Variáveis Identificadas:\n';
    for (const [variable, description] of Object.entries(variables)) {
      if (expression.includes(variable)) {
        analysis += `✅ **${variable}**: ${description}\n`;
      }
    }
    
    // Problemas comuns
    const commonIssues = [
      {
        pattern: /\$json\.[a-zA-Z_][a-zA-Z0-9_]*\s*\[/,
        issue: 'Mixing dot and bracket notation',
        fix: 'Use either $json.field or $json["field"]'
      },
      {
        pattern: /\$json\.\d/,
        issue: 'Field names starting with numbers',
        fix: 'Use bracket notation: $json["0field"]'
      },
      {
        pattern: /\$json\.[^a-zA-Z_]/,
        issue: 'Special characters in field names',
        fix: 'Use bracket notation: $json["field-name"]'
      }
    ];
    
    analysis += '\n## Problemas Detectados:\n';
    let hasIssues = false;
    for (const issue of commonIssues) {
      if (issue.pattern.test(expression)) {
        analysis += `⚠️ **${issue.issue}**: ${issue.fix}\n`;
        hasIssues = true;
      }
    }
    
    if (!hasIssues) {
      analysis += '✅ Nenhum problema comum detectado\n';
    }
    
    // Sugestões com dados de exemplo
    if (sample_data) {
      analysis += '\n## Testando com Dados de Exemplo:\n';
      analysis += '```json\n' + JSON.stringify(sample_data, null, 2) + '\n```\n\n';
      
      // Simular algumas avaliações comuns
      if (expression.includes('$json.')) {
        const fieldMatch = expression.match(/\$json\.([a-zA-Z_][a-zA-Z0-9_]*)/);
        if (fieldMatch && sample_data[fieldMatch[1]]) {
          analysis += `✅ Campo '${fieldMatch[1]}' existe nos dados\n`;
          analysis += `   Valor: ${JSON.stringify(sample_data[fieldMatch[1]])}\n`;
        }
      }
    }
    
    return analysis;
  }

  suggestIntegration(args) {
    const { system_a, system_b, use_case } = args;
    
    const integrationPatterns = {
      'salesforce-slack': {
        description: 'CRM para notificações',
        pattern: 'Webhook → Process → Notify',
        steps: [
          'Configure Salesforce Outbound Message ou Apex Trigger',
          'Webhook no n8n recebe dados do lead/opportunity',
          'Function node formata mensagem',
          'Slack node envia notificação para canal'
        ]
      },
      'gmail-sheets': {
        description: 'Email para planilha',
        pattern: 'Monitor → Parse → Store',
        steps: [
          'IMAP Trigger monitora emails',
          'Function node extrai dados relevantes',
          'IF node filtra por critérios',
          'Google Sheets adiciona linha'
        ]
      },
      'api-database': {
        description: 'API para banco de dados',
        pattern: 'Fetch → Transform → Store',
        steps: [
          'Schedule Trigger executa periodicamente',
          'HTTP Request busca dados da API',
          'Function node transforma formato',
          'Database node insere/atualiza registros'
        ]
      }
    };
    
    const key = `${system_a.toLowerCase()}-${system_b.toLowerCase()}`;
    const reverseKey = `${system_b.toLowerCase()}-${system_a.toLowerCase()}`;
    
    let suggestion = `# Integração: ${system_a} ↔ ${system_b}\n\n`;
    
    if (use_case) {
      suggestion += `**Caso de Uso**: ${use_case}\n\n`;
    }
    
    const pattern = integrationPatterns[key] || integrationPatterns[reverseKey];
    
    if (pattern) {
      suggestion += `## Padrão Sugerido: ${pattern.description}\n`;
      suggestion += `**Fluxo**: ${pattern.pattern}\n\n`;
      suggestion += '## Passos de Implementação:\n';
      pattern.steps.forEach((step, index) => {
        suggestion += `${index + 1}. ${step}\n`;
      });
    } else {
      // Sugestão genérica baseada nos sistemas
      suggestion += '## Abordagem Recomendada:\n\n';
      
      const systemTypes = {
        'api': ['api', 'rest', 'graphql', 'webhook'],
        'database': ['mysql', 'postgres', 'mongodb', 'redis'],
        'email': ['gmail', 'outlook', 'smtp', 'imap'],
        'storage': ['s3', 'drive', 'dropbox', 'ftp'],
        'messaging': ['slack', 'teams', 'telegram', 'discord'],
        'crm': ['salesforce', 'hubspot', 'pipedrive'],
        'ecommerce': ['shopify', 'woocommerce', 'magento']
      };
      
      const getSystemType = (system) => {
        for (const [type, keywords] of Object.entries(systemTypes)) {
          if (keywords.some(keyword => system.toLowerCase().includes(keyword))) {
            return type;
          }
        }
        return 'api'; // fallback
      };
      
      const typeA = getSystemType(system_a);
      const typeB = getSystemType(system_b);
      
      suggestion += `### ${system_a} (${typeA}) → ${system_b} (${typeB})\n\n`;
      
      // Trigger baseado no tipo A
      const triggers = {
        'api': 'Schedule Trigger para polling ou Webhook',
        'database': 'Schedule Trigger para monitoring',
        'email': 'IMAP Trigger para novos emails',
        'messaging': 'Webhook para mensagens'
      };
      
      suggestion += `1. **Trigger**: ${triggers[typeA] || 'Schedule Trigger'}\n`;
      suggestion += `2. **Extract**: Buscar dados de ${system_a}\n`;
      suggestion += `3. **Transform**: Converter formato conforme necessário\n`;
      suggestion += `4. **Load**: Enviar para ${system_b}\n`;
      suggestion += `5. **Error Handling**: Retry e notificações\n\n`;
      
      // Considerações específicas
      suggestion += '## Considerações Importantes:\n\n';
      suggestion += `- **Autenticação**: Verifique métodos suportados por ambos sistemas\n`;
      suggestion += `- **Rate Limits**: Implemente delays se necessário\n`;
      suggestion += `- **Data Mapping**: Mapeie campos entre os sistemas\n`;
      suggestion += `- **Error Recovery**: Plano para falhas de rede/API\n`;
      suggestion += `- **Monitoring**: Log e alertas para acompanhar integração\n`;
    }
    
    return suggestion;
  }

  optimizeWorkflow(args) {
    const { workflow_description, performance_issues, data_volume } = args;
    
    let optimization = `# Otimização de Workflow\n\n`;
    optimization += `**Descrição**: ${workflow_description}\n\n`;
    
    if (performance_issues) {
      optimization += `**Problemas Identificados**: ${performance_issues}\n\n`;
    }
    
    optimization += `**Volume de Dados**: ${data_volume || 'Não especificado'}\n\n`;
    
    // Sugestões baseadas no volume
    const volumeOptimizations = {
      'low': [
        'Foque na simplicidade e manutenibilidade',
        'Execution logs detalhados são aceitáveis',
        'Retry automático pode ser mais agressivo'
      ],
      'medium': [
        'Implemente batching para processamento em lotes',
        'Use Function Item ao invés de Function para melhor performance',
        'Considere cache para dados frequentemente acessados',
        'Optimize database queries com índices'
      ],
      'high': [
        'OBRIGATÓRIO: Processamento em batches pequenos',
        'Use SplitInBatches node para dividir grandes datasets',
        'Implemente queue system para processos longos',
        'Considere processamento assíncrono',
        'Monitor memory usage constantemente'
      ]
    };
    
    if (data_volume && volumeOptimizations[data_volume]) {
      optimization += `## Otimizações para Volume ${data_volume.toUpperCase()}:\n\n`;
      volumeOptimizations[data_volume].forEach((tip, index) => {
        optimization += `${index + 1}. ${tip}\n`;
      });
      optimization += '\n';
    }
    
    // Otimizações gerais
    optimization += '## Otimizações Gerais:\n\n';
    optimization += '### Performance\n';
    optimization += '- **Function vs Function Item**: Use Function Item para processar items individualmente\n';
    optimization += '- **Parallel Processing**: Use SplitInBatches + Merge para processamento paralelo\n';
    optimization += '- **Reduce API Calls**: Cache resultados quando possível\n';
    optimization += '- **Database Optimization**: Use prepared statements e connection pooling\n\n';
    
    optimization += '### Memory Management\n';
    optimization += '- **Clear Variables**: Remova variáveis grandes após uso\n';
    optimization += '- **Stream Processing**: Processe dados em streams para grandes volumes\n';
    optimization += '- **Garbage Collection**: Deixe objetos elegíveis para GC\n\n';
    
    optimization += '### Error Handling\n';
    optimization += '- **Continue on Fail**: Configure nodes para não parar workflow\n';
    optimization += '- **Exponential Backoff**: Para retry de APIs\n';
    optimization += '- **Circuit Breaker**: Pare tentativas após muitas falhas\n\n';
    
    // Sugestões baseadas em problemas específicos
    if (performance_issues) {
      optimization += '## Soluções para Problemas Específicos:\n\n';
      
      const problemSolutions = {
        'timeout': 'Aumente timeout ou implemente processamento assíncrono',
        'memory': 'Use SplitInBatches para reduzir carga de memória',
        'slow': 'Identifique gargalos com execution logs e otimize',
        'api': 'Implemente rate limiting e retry logic',
        'database': 'Optimize queries e use connection pooling'
      };
      
      for (const [problem, solution] of Object.entries(problemSolutions)) {
        if (performance_issues.toLowerCase().includes(problem)) {
          optimization += `- **${problem.toUpperCase()}**: ${solution}\n`;
        }
      }
    }
    
    // Exemplo de otimização
    optimization += '\n## Exemplo de Otimização:\n\n';
    optimization += '### Antes (Ineficiente):\n';
    optimization += '```javascript\n';
    optimization += '// Processa todos os items de uma vez\n';
    optimization += 'const items = $input.all();\n';
    optimization += 'const results = [];\n';
    optimization += 'for (const item of items) {\n';
    optimization += '  const apiResult = await fetch(`/api/${item.json.id}`);\n';
    optimization += '  results.push(await apiResult.json());\n';
    optimization += '}\n';
    optimization += 'return results.map(r => ({json: r}));\n';
    optimization += '```\n\n';
    
    optimization += '### Depois (Otimizado):\n';
    optimization += '```javascript\n';
    optimization += '// Use SplitInBatches node antes + Function Item\n';
    optimization += '// Processa um item por vez com cache\n';
    optimization += 'const cache = $vars.apiCache || {};\n';
    optimization += 'const id = $json.id;\n\n';
    optimization += 'if (cache[id]) {\n';
    optimization += '  return {json: cache[id]};\n';
    optimization += '}\n\n';
    optimization += 'const response = await fetch(`/api/${id}`);\n';
    optimization += 'const result = await response.json();\n\n';
    optimization += '// Salva no cache\n';
    optimization += 'cache[id] = result;\n';
    optimization += '$vars.apiCache = cache;\n\n';
    optimization += 'return {json: result};\n';
    optimization += '```\n\n';
    
    optimization += '## Métricas para Monitorar:\n\n';
    optimization += '- **Execution Time**: Tempo total de execução\n';
    optimization += '- **Memory Usage**: Uso de memória durante execução\n';
    optimization += '- **API Response Times**: Latência das chamadas externas\n';
    optimization += '- **Error Rate**: Taxa de falhas por período\n';
    optimization += '- **Throughput**: Items processados por minuto\n';
    
    return optimization;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Automation MCP server running on stdio');
  }
}

const server = new AutomationServer();
server.run().catch(console.error);