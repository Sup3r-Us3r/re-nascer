# API Integration - Renascer Frontend

Este documento descreve a integração entre o frontend e a API do sistema Renascer.

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend com:

```env
VITE_API_URL=http://localhost:3000
```

### Estrutura de Arquivos

```
src/
├── services/
│   ├── api.ts          # Configuração base da API
│   ├── suppliers.ts    # Serviços específicos de fornecedores
│   └── clients.ts      # Serviços específicos de clientes
├── config/
│   └── api.ts          # Configurações da API
├── hooks/
│   ├── useApi.ts       # Hook para chamadas de API
│   └── useData.ts      # Hook do contexto de dados
├── types/
│   └── index.ts        # Definições de tipos TypeScript
└── contexts/
    └── DataContext.tsx # Contexto global de dados
```

## Funcionalidades Implementadas

### Fornecedores (Suppliers)

#### Endpoints Integrados

- **GET /suppliers** - Lista todos os fornecedores
- **GET /suppliers/:id** - Busca fornecedor por ID
- **POST /suppliers** - Cria novo fornecedor
- **PUT /suppliers/:id** - Atualiza fornecedor
- **DELETE /suppliers/:id** - Remove fornecedor

#### Mapeamento de Tipos

O sistema converte automaticamente entre os tipos da API e do frontend:

**API → Frontend:**

- `id` (number) → `id` (string)
- `taxId` → `document`
- `supplierType` (`Collector|Agent|Company`) → `type` (`catador|agenciador|empresa`)

**Frontend → API:**

- `id` (string) → `id` (number)
- `document` → `taxId`
- `type` (`catador|agenciador|empresa`) → `supplierType` (`Collector|Agent|Company`)

### Clientes (Clients)

#### Endpoints Integrados

- **GET /clients** - Lista todos os clientes
- **GET /clients/:id** - Busca cliente por ID
- **POST /clients** - Cria novo cliente
- **PUT /clients/:id** - Atualiza cliente
- **DELETE /clients/:id** - Remove cliente

#### Mapeamento de Tipos

O sistema converte automaticamente entre os tipos da API e do frontend:

**API → Frontend:**

- `id` (number) → `id` (string)
- `taxId` → `document`

**Frontend → API:**

- `id` (string) → `id` (number)
- `document` → `taxId`

## Uso

### Adicionando um Fornecedor

```typescript
import { supplierService } from '@/services/suppliers';

const newSupplier = await supplierService.create({
  name: 'João Silva',
  document: '123.456.789-00',
  phone: '(11) 98765-4321',
  email: 'joao@email.com',
  address: 'Rua das Flores, 123',
  type: 'catador',
  materialType: 'PP Moído',
});
```

### Atualizando um Fornecedor

```typescript
import { supplierService } from '@/services/suppliers';

await supplierService.update(1, {
  name: 'João Silva Santos',
  phone: '(11) 99999-8888',
});
```

### Adicionando um Cliente

```typescript
import { clientService } from '@/services/clients';

const newClient = await clientService.create({
  name: 'Indústria ABC Ltda',
  document: '12.345.678/0001-00',
  phone: '(11) 3456-7890',
  email: 'contato@abc.com.br',
  address: 'Av. Industrial, 456',
});
```

### Atualizando um Cliente

```typescript
import { clientService } from '@/services/clients';

await clientService.update(1, {
  name: 'Indústria ABC S.A.',
  phone: '(11) 3456-7899',
});
```

### Usando o Context

```typescript
import { useData } from '@/hooks/useData';

function MyComponent() {
  const {
    suppliers,
    suppliersLoading,
    clients,
    clientsLoading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    refreshSuppliers,
    addClient,
    updateClient,
    deleteClient,
    refreshClients,
  } = useData();

  // Componente automaticamente re-renderiza quando dados mudam
}
```

## Tratamento de Erros

### Tipos de Erro

```typescript
class ApiError extends Error {
  status: number; // Código HTTP (404, 500, etc.)
  message: string; // Mensagem de erro
  details?: unknown; // Detalhes adicionais do erro
}
```

### Tratamento Automático

- ✅ Erros são automaticamente capturados e exibidos via toast
- ✅ Loading states são gerenciados automaticamente
- ✅ Estados de erro são limpos automaticamente
- ✅ Retry automático em caso de falha de rede

### Tratamento Manual

```typescript
try {
  await supplierService.create(supplierData);
  // ou
  await clientService.create(clientData);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      toast.error('Registro já existe');
    } else {
      toast.error(`Erro: ${error.message}`);
    }
  }
}
```

## Componentes Atualizados

### SupplierDialog

- ✅ Integração com API
- ✅ Validação de formulário
- ✅ Estados de loading
- ✅ Tratamento de erros

### SuppliersTab

- ✅ Lista fornecedores da API
- ✅ Busca/filtro local
- ✅ Ações de editar/excluir
- ✅ Botão de atualizar
- ✅ Estados de loading

### ClientDialog

- ✅ Integração com API
- ✅ Validação de formulário
- ✅ Estados de loading
- ✅ Tratamento de erros

### ClientsTab

- ✅ Lista clientes da API
- ✅ Busca/filtro local
- ✅ Ações de editar/excluir
- ✅ Botão de atualizar
- ✅ Estados de loading

### DataContext

- ✅ Gerenciamento de estado global para fornecedores e clientes
- ✅ Cache local de dados
- ✅ Sincronização com API
- ✅ Loading states

- ✅ Integração com API
- ✅ Validação de formulário
- ✅ Estados de loading
- ✅ Tratamento de erros

### SuppliersTab

- ✅ Lista fornecedores da API
- ✅ Busca/filtro local
- ✅ Ações de editar/excluir
- ✅ Botão de atualizar
- ✅ Estados de loading

### DataContext

- ✅ Gerenciamento de estado global
- ✅ Cache local de dados
- ✅ Sincronização com API
- ✅ Loading states

## Próximos Passos

Para completar a integração:

1. **Implementar integração para outros recursos:**

   - Clientes (Clients)
   - Pontos de Coleta (Collection Points)
   - Tipos de Produto (Product Types)
   - Coletas (Collections)
   - Vendas (Sales)

2. **Adicionar funcionalidades avançadas:**

   - Paginação
   - Ordenação
   - Filtros avançados
   - Cache com TTL
   - Offline support

3. **Melhorias de UX:**
   - Skeleton loading
   - Confirmações de ação
   - Undo/Redo
   - Auto-save

## Debugging

### Logs da API

Todas as chamadas de API são logadas no console do navegador em desenvolvimento.

### Verificar Conectividade

```typescript
import { api } from '@/services/api';

// Teste de conectividade
try {
  await api.get('/suppliers');
  console.log('API conectada');
} catch (error) {
  console.error('Erro de conectividade:', error);
}
```

### Estados do Context

```typescript
// Adicione este código para debuggar o estado
const data = useData();
console.log('Context state:', data);
```
