# Site acadêmico · Luís Felipe Ignácio Cunha

Site estático multilíngue desenvolvido em Vite + Vue, com geração estática de HTML para português, inglês e espanhol.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

O build é independente do caminho de implantação: os assets usam URLs relativas e as páginas são gerenciadas pelo hash da URL. O mesmo conteúdo de `dist/` pode ser publicado na raiz ou em qualquer subpasta.

## Build estático

```bash
pnpm build
pnpm validate
```

O resultado fica em `dist/`. Publique seu conteúdo diretamente no diretório desejado do servidor; não é necessário configurar a subpasta no código.

## Conteúdo

- `src/data/site.js`: textos institucionais e traduções.
- `src/data/courses.js`: disciplinas, ementas, bibliografias e materiais.
- `src/data/publications.js`: coleção canônica de publicações, compartilhada pelos três idiomas.
- `src/router/paths.js`: URLs localizadas.
- `public/materials/legacy/`: 153 materiais didáticos preservados.
- `archive/legacy-site/`: páginas e ativos do site anterior para auditoria.

Para adicionar uma disciplina, inclua um objeto em `src/data/courses.js`, acrescente seus caminhos em `src/router/paths.js` e copie os arquivos para `public/materials/`.

## Atualização do acervo legado

```powershell
./scripts/download-legacy-assets.ps1
```

O script baixa novamente apenas os arquivos ausentes e mantém os destinos dentro do repositório.
