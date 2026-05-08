# Guia rápido de edição — TX MODE V2

## 1. Trocar nome da marca
Arquivo: `app.js`

Procure:
```js
const BRAND_CONFIG = {
  appName: "Equipe TX",
  subtitle: "MiniApp Mobile-First",
  whatsappNumber: "5599999999999"
};
```

## 2. Trocar número do WhatsApp
Arquivo: `app.js`

Altere:
```js
whatsappNumber: "5599999999999"
```

Use país + DDD + número.

## 3. Alterar produtos
Arquivo: `app.js`

Procure `data.produtos`. Cada linha segue:
```js
["ícone", "Nome do produto", "Descrição", "Status"]
```

## 4. Alterar CRM
Arquivo: `app.js`

Procure `data.clientes`. Cada cliente segue:
```js
["👤", "Nome", "Descrição", "Status"]
```

## 5. Alterar permissões
Arquivo: `app.js`

Procure `permissions`.

Exemplo:
```js
cliente: ["home", "produtos", "avisos", "equipe"]
```

## 6. Alterar cores
Arquivo: `style.css`

Procure `:root`.

As principais são:
- `--gold` dourado
- `--green` verde
- `--bg` fundo
- `--card` cards
- `--text` texto

## 7. Alterar menu inferior
Arquivo: `index.html`

Procure:
```html
<nav class="bottom-nav">
```

## 8. Publicar no Netlify
1. Extraia o ZIP.
2. Entre no Netlify.
3. Add new site → Deploy manually.
4. Arraste a pasta extraída.
