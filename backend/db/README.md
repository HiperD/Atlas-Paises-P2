# Setup do PostgreSQL

## Passos para criar a database

### 1. Criar a database
Abra o terminal ou psql e execute:

```bash
createdb atlas_paises -U postgres
```

Ou via psql:
```sql
CREATE DATABASE atlas_paises;
```

### 2. Executar o schema
```bash
psql -U postgres -d atlas_paises -f schema.sql
```

### 3. Executar o seed (dados iniciais)
```bash
psql -U postgres -d atlas_paises -f seed.sql
```

## Dados de acesso

**Usuário padrão para login:**
- Username: `admin`
- Senha: `123456`

## Verificação

Após executar os scripts, conecte-se à database:

```bash
psql -U postgres -d atlas_paises
```

E execute:
```sql
SELECT * FROM users;
SELECT COUNT(*) FROM countries;
SELECT * FROM security_logs;
```

## Notas

- A tabela `security_logs` registra login, buscas e inserções.
- O hash da senha foi pré-gerado com `bcryptjs` para "123456".
- Os países no seed são apenas exemplos; você pode adicionar mais conforme necessário.
