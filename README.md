# Horizoncraft

Horizoncraft é uma história e um universo fictício criados por Théo. Este site foi feito para apresentar seus capítulos, personagens, poderes e desenhos, enquanto a área administrativa privada permite que Théo e seu responsável desenvolvam esse conteúdo ao longo do tempo.

## Tecnologias

- Next.js 16 com App Router e TypeScript
- React 19 e Tailwind CSS 4
- Supabase Auth, Postgres e Storage
- Zod para validação
- Vitest para testes essenciais
- ESLint para qualidade de código

## Executar localmente

Requisitos: Node.js 22 ou versão LTS compatível e npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`. Sem valores no `.env.local`, o site público usa dados fictícios locais e `/admin` exibe as instruções de configuração.

## Configurar um projeto gratuito no Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e um projeto no plano gratuito.
2. No painel do projeto, abra **SQL Editor**.
3. Copie e execute todo o arquivo `supabase/migrations/202609020001_initial_schema.sql`.
4. Em seguida, execute `supabase/migrations/202609020002_identity_and_content_refresh.sql` e `supabase/migrations/202609020003_featured_characters.sql`, nessa ordem. Elas instalam a mensagem “Parabéns, Théo!”, os primeiros quatro personagens confirmados e o marcador de destaque. A galeria permanece vazia até receber um desenho real.
5. Em **Project Settings → API**, copie a URL do projeto e a chave pública/anônima.
6. Preencha o `.env.local` conforme o exemplo abaixo.

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Nunca adicione a chave `service_role` ao projeto ou ao navegador. Ela não é necessária para o Horizoncraft.

## Criar a conta administradora

O site não oferece cadastro público.

1. No Supabase, abra **Authentication → Users → Add user**.
2. Crie o único usuário administrador com um e-mail controlado pelo responsável e uma senha forte.
3. Copie o UUID do usuário.
4. No SQL Editor, execute o comando abaixo, substituindo o UUID:

```sql
update public.profiles
set is_admin = true, display_name = 'Nome artístico'
where id = 'UUID-DO-USUARIO';
```

Use apenas apelido ou nome artístico em `display_name`. Depois, acesse `http://localhost:3000/admin/login`.

## Editar a mensagem de aniversário

Depois de entrar no painel, abra **A história → Parabéns, Théo! → Uma aventura muito especial começa hoje**. O texto está separado em blocos e pode ser revisado antes da publicação. No modo sem Supabase, a versão local fica em `lib/demo-data.ts`, identificada por um comentário em inglês.

## Armazenamento de imagens

A migração cria automaticamente o bucket privado `media` com:

- JPEG, PNG e WebP permitidos;
- limite de 3 MB por arquivo;
- envio, substituição e exclusão restritos ao administrador;
- leitura anônima somente quando o arquivo estiver ligado a uma história, capítulo, personagem ou item da galeria publicado.

O painel valida o arquivo antes do envio, mostra uma prévia, cria um nome aleatório e converte imagens para WebP com largura ou altura máxima de 1.800 px quando possível.

## Modelo de conteúdo

As tabelas principais são `profiles`, `stories`, `chapters`, `characters`, `powers`, `character_powers` e `gallery_items`. Todas usam Row Level Security. Rascunhos ficam privados; somente registros publicados são legíveis pelo público.

Capítulos são armazenados como uma lista JSON de blocos permitidos: parágrafo, título intermediário, citação, lista e imagem. O leitor transforma esses blocos diretamente em componentes React. HTML fornecido pelo usuário não é executado.

## Verificações

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Publicação futura na Vercel

Quando chegar a hora de publicar:

1. Crie um repositório **privado** no GitHub.
2. Revise `git status` e confirme que `.env.local` não será enviado.
3. Adicione o repositório remoto e envie a branch principal.
4. Importe o repositório na Vercel.
5. Cadastre as três variáveis de ambiente do `.env.example` nas configurações da Vercel.
6. Defina `NEXT_PUBLIC_SITE_URL` com o domínio final e faça uma nova implantação.

Essas ações não são executadas automaticamente por este projeto.

## Backup manual

Para um backup simples das histórias:

1. No Supabase, abra **Table Editor**.
2. Exporte `stories`, `chapters`, `characters`, `powers`, `character_powers` e `gallery_items` em CSV.
3. No Storage, abra o bucket `media` e baixe os arquivos para uma pasta local.
4. Guarde os CSVs e a pasta de imagens juntos, com a data do backup no nome.

Para restaurar, importe primeiro as histórias, depois capítulos, personagens, poderes, relações e galeria. Envie as imagens mantendo os caminhos registrados nos campos `cover_path`, `image_path` e nos blocos de capítulos.

## Segurança e privacidade

- Não há comentários, mensagens privadas, cadastro de leitores, analytics ou uploads públicos.
- Não publique nome completo, idade, escola, endereço, localização, telefone, e-mail ou redes sociais do autor.
- Todo conteúdo novo começa como rascunho.
- A conta administrativa deve ser compartilhada apenas com o responsável.
- Faça backups periódicos e use uma senha longa e exclusiva.

## Estrutura principal

- `app/`: páginas públicas, leitor e painel administrativo
- `components/`: componentes reutilizáveis públicos e administrativos
- `lib/`: tipos, dados de demonstração e integração com Supabase
- `supabase/migrations/`: esquema, índices e políticas de segurança
- `supabase/seed.sql`: arquivo vazio por segurança; o conteúdo inicial confirmado está nas migrações
- `tests/`: testes essenciais

## Limites da primeira versão

Não fazem parte desta versão: colaboração em tempo real, histórico avançado de versões, comentários, mensagens, cadastro de leitores, analytics, editor visual de páginas de quadrinhos e edição automática de imagens. Essas funcionalidades devem ser avaliadas apenas se houver uma necessidade clara e segura no futuro.
