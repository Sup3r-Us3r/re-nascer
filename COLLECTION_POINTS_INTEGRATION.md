# Integração de Pontos de Coleta - API Integration

## Implementação Completa

A integração dos pontos de coleta com a API foi implementada seguindo o mesmo padrão estabelecido para fornecedores e clientes, garantindo consistência e manutenibilidade do código.

## Arquivos Criados/Modificados

### 1. Types (`src/types/index.ts`)

```typescript
// Tipos da API
export interface CollectionPointAPI {
  id: number;
  name: string;
  responsible: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos do Frontend
export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  responsible: string;
  createdAt: string;
}

// Tipos para requisições
export interface CreateCollectionPointRequest {
  name: string;
  responsible: string;
  address: string;
  phone: string;
  email: string;
}

export type UpdateCollectionPointRequest =
  Partial<CreateCollectionPointRequest>;
```

### 2. Serviço de API (`src/services/collection-points.ts`)

```typescript
export const collectionPointService = {
  async getAll(): Promise<CollectionPoint[]>
  async getById(id: number): Promise<CollectionPoint>
  async create(data: Omit<CollectionPoint, 'id' | 'createdAt'>): Promise<CollectionPoint>
  async update(id: number, data: Partial<CollectionPoint>): Promise<CollectionPoint>
  async delete(id: number): Promise<void>
}
```

**Funcionalidades:**

- Conversão automática entre formatos da API e do frontend
- Tratamento de erros com ApiError
- Tipagem completa com TypeScript
- Validação de dados antes do envio

### 3. Context Atualizado (`src/contexts/DataContext.tsx`)

```typescript
interface DataContextType {
  // Estados
  collectionPoints: CollectionPoint[];
  collectionPointsLoading: boolean;

  // Funções
  addCollectionPoint: (
    point: Omit<CollectionPoint, 'id' | 'createdAt'>
  ) => Promise<void>;
  updateCollectionPoint: (
    id: string,
    point: Partial<CollectionPoint>
  ) => Promise<void>;
  deleteCollectionPoint: (id: string) => Promise<void>;
  refreshCollectionPoints: () => Promise<void>;
}
```

**Funcionalidades:**

- Carregamento automático dos dados na inicialização
- Estados de loading para melhor UX
- Tratamento de erros com notificações toast
- Atualização automática da lista após operações CRUD

### 4. Componente CollectionPointsTab (`src/components/cadastros/CollectionPointsTab.tsx`)

```typescript
export function CollectionPointsTab({ onEdit }: CollectionPointsTabProps) {
  const { collectionPoints, collectionPointsLoading, deleteCollectionPoint } =
    useData();
  // ...
}
```

**Melhorias implementadas:**

- Estado de loading durante carregamento dos dados
- Função de delete assíncrona com tratamento de erro
- Interface responsiva e consistente
- Busca/filtro em tempo real

### 5. Dialog de Ponto de Coleta (`src/components/cadastros/CollectionPointDialog.tsx`)

```typescript
const onSubmit = async (data: PointFormData) => {
  try {
    if (isEditing && point) {
      await updateCollectionPoint(point.id, data);
      toast.success('Ponto de coleta atualizado com sucesso');
    } else {
      await addCollectionPoint(data);
      toast.success('Ponto de coleta cadastrado com sucesso');
    }
    onOpenChange(false);
  } catch (error) {
    // Error is already handled by the context
  }
};
```

**Funcionalidades:**

- Formulário com validação completa usando Zod
- Suporte para criação e edição
- Máscaras de input para telefone
- Tratamento assíncrono de operações

## Endpoints da API Integrados

### GET /collection-points

- **Propósito**: Listar todos os pontos de coleta
- **Response**: Array de CollectionPointAPI
- **Frontend**: Carregado automaticamente na inicialização

### GET /collection-points/:id

- **Propósito**: Buscar ponto de coleta específico
- **Response**: CollectionPointAPI
- **Frontend**: Disponível no serviço para uso futuro

### POST /collection-points

- **Propósito**: Criar novo ponto de coleta
- **Body**: CreateCollectionPointRequest
- **Response**: CollectionPointAPI
- **Frontend**: Integrado no dialog de criação

### PUT /collection-points/:id

- **Propósito**: Atualizar ponto de coleta existente
- **Body**: UpdateCollectionPointRequest
- **Response**: CollectionPointAPI
- **Frontend**: Integrado no dialog de edição

### DELETE /collection-points/:id

- **Propósito**: Excluir ponto de coleta
- **Response**: 204 No Content
- **Frontend**: Integrado na lista com confirmação

## Tratamento de Erros

### Validação no Frontend

```typescript
const pointSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido'),
  responsible: z.string().min(1, 'Responsável é obrigatório'),
});
```

### Tratamento de Erros da API

- **ApiError**: Classe customizada para erros da API
- **Toast notifications**: Exibição de erros amigáveis para o usuário
- **Loading states**: Indicadores visuais durante operações

## Conversão de Tipos

### API → Frontend

```typescript
function convertToFrontendCollectionPoint(
  apiCollectionPoint: CollectionPointAPI
): CollectionPoint {
  return {
    id: apiCollectionPoint.id.toString(),
    name: apiCollectionPoint.name,
    address: apiCollectionPoint.address,
    phone: apiCollectionPoint.phone,
    email: apiCollectionPoint.email,
    responsible: apiCollectionPoint.responsible,
    createdAt: apiCollectionPoint.createdAt,
  };
}
```

### Frontend → API

```typescript
function convertToApiCollectionPoint(
  frontendData: Omit<CollectionPoint, 'id' | 'createdAt'>
): CreateCollectionPointRequest {
  return {
    name: frontendData.name,
    responsible: frontendData.responsible,
    address: frontendData.address,
    phone: frontendData.phone,
    email: frontendData.email,
  };
}
```

## Estado Atual

✅ **Completo**: Integração total com a API
✅ **Tipagem**: TypeScript em todos os níveis
✅ **Validação**: Formulários com Zod validation
✅ **UX**: Loading states e error handling
✅ **Consistência**: Padrão alinhado com fornecedores e clientes

## Como Usar

1. **Listar pontos de coleta**: Automático na página de cadastros
2. **Criar novo ponto**: Clique em "Novo Cadastro" → aba "Pontos de Coleta"
3. **Editar ponto**: Clique no ícone de edição na lista
4. **Excluir ponto**: Clique no ícone de lixeira e confirme

## Próximos Passos

A integração dos pontos de coleta está completa. Para manter a consistência, os próximos módulos (Tipos de Produtos, Coletas e Vendas) devem seguir o mesmo padrão:

1. Criar tipos TypeScript para API e frontend
2. Implementar serviço com conversões automáticas
3. Atualizar DataContext com funções assíncronas
4. Implementar loading states nos componentes
5. Adicionar tratamento de erros e validações
