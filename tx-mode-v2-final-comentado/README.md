# TX MODE V2 — MiniApp comentado

Projeto HTML/CSS/JS puro, mobile-first, pronto para Netlify.

## Arquivos principais

- `index.html` — estrutura base do app, cabeçalho e menu inferior.
- `style.css` — visual, cores, espaçamentos, cards e navegação.
- `app.js` — telas, textos, dados, produtos, CRM, permissões e módulos.
- `data/` — pasta preparada para futura separação dos dados em JSON.
- `docs/GUIA-EDICAO.md` — guia rápido do que alterar.

## Como testar no PC

1. Extraia o ZIP.
2. Abra o arquivo `index.html` no navegador.
3. Para publicar, envie a pasta inteira no Netlify.

## Como editar rápido

Abra `app.js` e procure por:

- `BRAND_CONFIG` para nome, subtítulo e WhatsApp.
- `data.produtos` para alterar produtos.
- `data.avisos` para alterar avisos.
- `data.clientes` para CRM.
- `permissions` para controlar cliente/equipe/gestor.

Abra `style.css` e procure por:

- `:root` para alterar cores.
- `.phone-shell` para alterar largura.
- `.bottom-nav` para alterar menu inferior.
- `.card`, `.item`, `.hero` para alterar componentes.
