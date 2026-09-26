# Arquivo do site legado

Este diretório preserva as páginas e os ativos visuais do site anterior para fins de auditoria e migração. O site novo não depende destes arquivos em produção.

Os materiais didáticos republicados ficam em `public/materials/legacy/`, mantendo a árvore original por disciplina. O currículo usado no site fica em `public/documents/`.

Para refazer o download a partir da fonte pública:

```powershell
./scripts/download-legacy-assets.ps1
```

O script ignora arquivos já baixados e valida que todos os destinos permaneçam dentro deste repositório.
