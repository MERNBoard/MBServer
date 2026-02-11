# MBServer

Backend da aplicação MERNBoard - API REST para gerenciamento de tarefas.

## Sobre

MBServer é a API do MERNBoard, um sistema completo de gerenciamento de tarefas construído com Node.js, Express, MongoDB e TypeScript. A aplicação oferece autenticação JWT, validação robusta de dados e operações CRUD completas para tarefas.

## Tecnologias

- **Node.js** com **TypeScript**
- **Express** - Framework web minimalista
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação stateless
- **Zod** - Validação de schemas type-safe
- **Bcrypt** - Hash de senhas
- **Biome** - Linter e formatter

## Funcionalidades

- Autenticação e autorização com JWT
- Registro e login de usuários
- CRUD completo de tarefas
- Validação de dados com Zod
- Proteção de rotas com middlewares
- Criptografia de senhas com bcrypt
- Timestamps automáticos
- Suporte a categorias, tags e prioridades

## Instalação

### Pré-requisitos

- Node.js 18 ou superior
- MongoDB 4.4 ou superior
- Yarn ou npm

### Configuração

1. Clone o repositório:
```bash
git clone https://github.com/MERNBoard/MBServer.git
cd MBServer
```

2. Instale as dependências:
```bash
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/mbserver
JWT_ACCESS_SECRET=seu_secret_super_seguro_aqui
BCRYPT_SALT_ROUNDS=10
```

5. Inicie o servidor:
```bash
yarn dev
```

O servidor estará rodando em `http://localhost:3000`

## Scripts

- `yarn dev` - Inicia o servidor em modo desenvolvimento com hot reload
- `yarn build` - Compila o projeto para produção
- `yarn lint` - Executa o linter (Biome)
- `yarn format` - Formata o código
- `yarn typecheck` - Verifica tipos TypeScript

## Estrutura do Projeto

```
src/
├── config/              # Configurações (database, env)
├── controllers/         # Controladores das rotas
│   ├── auth.controller.ts
│   └── tarefa.controller.ts
├── middlewares/         # Middlewares (autenticação, cache)
│   └── auth.middleware.ts
├── models/              # Modelos do Mongoose
│   ├── usuario.model.ts
│   └── tarefa.model.ts
├── schemas/             # Schemas de validação (Zod)
│   ├── usuario.schema.ts
│   └── tarefa.schema.ts
├── services/            # Lógica de negócio
│   ├── auth.token.service.ts
│   ├── usuario.service.ts
│   └── tarefa.service.ts
├── types/               # Tipos, interfaces e enums
│   ├── enums/
│   ├── interfaces/
│   └── types/
└── server.ts            # Ponto de entrada da aplicação
```

## Documentação da API

A documentação completa das rotas está disponível em [Documentação da API](./wiki/API).

### Endpoints Principais

#### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/registrar` - Registro de novo usuário

#### Tarefas (Protegidas)
- `GET /usuario/tarefas` - Listar tarefas do usuário
- `POST /usuario/tarefas` - Criar nova tarefa
- `PUT /usuario/tarefas/:id` - Atualizar tarefa
- `PATCH /usuario/tarefas/:id` - Atualizar tarefa parcialmente
- `DELETE /usuario/tarefas/:id` - Deletar tarefa

### Exemplo de Uso

```bash
# Registrar usuário
curl -X POST http://localhost:3000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@example.com","password":"senha123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'

# Criar tarefa (com token)
curl -X POST http://localhost:3000/usuario/tarefas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"titulo":"Estudar Node.js","prioridade":"ALTA"}'
```

## Segurança

- Senhas são criptografadas com bcrypt (10 rounds por padrão)
- Tokens JWT expiram em 7 dias
- Validação de entrada em todas as rotas
- Proteção contra injeção de código
- CORS habilitado
- Cada usuário só acessa suas próprias tarefas

## Modelos de Dados

### Usuario
```typescript
{
  nome: string
  email: string (único)
  passwordHash: string
  usuarioRole: "USUARIO" | "ADMIN"
  criadoEm: Date
  atualizadoEm: Date
}
```

### Tarefa
```typescript
{
  usuarioID: ObjectId
  titulo: string
  descricao?: string
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA"
  prioridade: "BAIXA" | "MEDIA" | "ALTA"
  categoria?: string
  tags?: string[]
  deadline?: Date
  completadaEm?: Date
  criadoEm: Date
  atualizadoEm: Date
}
```

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

**9erikSantos6**
- GitHub: [@9erikSantos6](https://github.com/9erikSantos6)
- Email: 9xerix6@gmail.com

## Links

- [Documentação da API](./wiki/API)
- [Repositório](https://github.com/MERNBoard/MBServer)
