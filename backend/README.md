# Atlas Paises Pj2 - Backend

Backend em Express para atender a proposta do projeto com autenticacao, busca e insercao usando PostgreSQL.

## Estrutura

- `src/routes`: rotas e controladores
- `src/models`: acesso ao banco
- `src/config`: configuracoes de ambiente e banco

## Rotas

- `GET /health`
- `POST /api/auth/login`
- `GET /api/countries`
- `POST /api/countries`

## Proximos passos

1. Criar o schema do PostgreSQL.
2. Popular um usuario inicial para login.
3. Ligar o frontend do Vite a esta API.
