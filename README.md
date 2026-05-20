# SauceDemo Test Automation

Projeto de automacao de testes para o site [SauceDemo](https://www.saucedemo.com/) usando Playwright para UI/API e k6 para performance.

## Stack

- Playwright
- JavaScript
- Page Object Model
- k6
- GitHub Actions

## Estrutura

```text
pages/
  LoginPage.js
  CheckoutPage.js

tests/
  api/
    saucedemo-http.spec.js
  performance/
    saucedemo-load.test.js
  ui/
    checkout.spec.js
    login.spec.js
    special-users.spec.js
```

## Instalacao

```powershell
npm ci
npx playwright install
```

Para Linux em CI, o workflow usa:

```bash
npx playwright install --with-deps
```

## Comandos

Rodar todos os testes Playwright:

```powershell
npm test
```

Rodar testes de API/HTTP:

```powershell
npm run test:api
```

Rodar testes estaveis para CI, ignorando exploratorios:

```powershell
npm run test:ci
```

Rodar cenarios exploratorios dos usuarios especiais:

```powershell
npm run test:exploratory
```

Abrir Playwright UI:

```powershell
npm run test:ui
```

Rodar performance com k6:

```powershell
npm run test:performance
```

## Suites

### UI

Os testes de UI ficam em `tests/ui`.

- `login.spec.js`: fluxo de login, usuarios validos, usuario bloqueado e validacoes de campos obrigatorios.
- `checkout.spec.js`: fluxo principal de compra, cenarios alternativos e validacoes do checkout.
- `special-users.spec.js`: cenarios exploratorios marcados com `@exploratory`.

### API/HTTP

Os testes em `tests/api` validam contratos HTTP das rotas publicas da aplicacao:

- status de resposta;
- `content-type`;
- conteudo minimo esperado;
- rota inexistente retornando `404`.

Eles rodam no projeto Playwright `api`, sem browser.

### Performance

O teste k6 fica em `tests/performance/saucedemo-load.test.js`.

Ele mede as principais paginas do fluxo:

- login;
- inventario;
- carrinho;
- checkout;
- confirmacao.

Importante: testes k6 devem ser executados com o runtime do k6, nao com Playwright. O Playwright ignora a pasta `tests/performance`.

## Pipeline

O workflow principal fica em `.github/workflows/playwright.yml`.

Ele roda:

- testes de API;
- testes UI estaveis;
- upload do relatorio HTML do Playwright.

Os testes de performance com k6 ficam fora do CI/CD por enquanto e podem ser executados localmente quando necessario.

## Git

Depois de inicializar o repositorio:

```powershell
git add .
git commit -m "Initial test automation setup"
```

Para enviar ao GitHub:

```powershell
git remote add origin URL_DO_REPOSITORIO
git push -u origin master
```
