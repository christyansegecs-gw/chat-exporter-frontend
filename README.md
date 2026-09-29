# GameWiz Chat Exporter Frontend

Frontend React + TypeScript + Vite para consulta interna da Chat Exporter API.

## Integração

- API no mesmo domínio, via `/api`.
- Autenticação Bearer Token informada pelo usuário no acesso.
- O token fica somente em memória no navegador e não é persistido pelo frontend.
- A busca usa `POST /api/conversations/search` e consome as conversas completas retornadas em `items`.
- Não há paginação nem chamadas individuais por `thread_key` no fluxo da interface.
- A interface exige data inicial e final antes da busca para evitar consultas acidentais de volume irrestrito.

## Desenvolvimento

```bash
npm ci
npm run dev
```

## Validação

```bash
npm run lint
npm run build
```

## Build de produção

```bash
npm ci
npm run build
```

O conteúdo gerado em `dist/` deve ser publicado no Nginx do frontend.
