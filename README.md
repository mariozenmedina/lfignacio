# Site acadêmico · Luís Felipe Ignácio Cunha

Site estático multilíngue desenvolvido em Vite + Vue, com geração estática de HTML para português, inglês e espanhol.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

O projeto usa `/~lfignacio/` como subpasta padrão. Para outra subpasta, defina `BASE_PATH` antes de executar o build.

```powershell
$env:BASE_PATH = '/homologacao/'; pnpm build
```

```bash
BASE_PATH=/homologacao/ pnpm build
```

## Build estático

```bash
pnpm build
pnpm validate
```

O resultado fica em `dist/`. Cada rota possui seu próprio `index.html`, metadados, URL canônica e links `hreflang`.

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
