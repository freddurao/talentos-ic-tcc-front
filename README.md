# Talentos IC - Frontend

Frontend da aplicação **Talentos IC**, desenvolvido em React e responsável pela interface do usuário, autenticação e comunicação com a API.

---

## Tecnologias

O projeto foi desenvolvido utilizando:

- Node.js
- React
- React Router 
- Axios
- Bulma
- Docker
- ESLint
- Prettier

---

## Arquitetura

A arquitetura da aplicação pode ser visualizada na imagem abaixo.

[Arquitetura do Projeto](https://imgur.com/a/gg1vlhT)

---

## Documentação

### Manual de Implantação

A documentação completa de implantação encontra-se disponível [aqui](https://docs.google.com/document/d/1IlNzT2h87PjmWpdiZwCwqP_4VFyZkq6ARqbqVcQJrlk/edit?usp=sharing).

### Prototipação

O protótipo da interface pode ser acessado através do Figma:

> **Figma:** https://www.figma.com/design/3pqEFG0PjnKyN2JtaTxePs/Talentic---Refactor?node-id=0-1&t=IKaJ0yv5yCiBMqox-1

> **Observação:** O protótipo representa a concepção inicial da interface. A implementação atual contempla atualizações e melhorias realizadas durante a evolução do projeto.

---

## Como executar

### Pré-requisitos

- Node.js 18 ou superior

---

### Clonando o repositório

```bash
git clone https://github.com/freddurao/talentos-ic-tcc-front

cd talentos-ic-tcc-front
```

---

### Configurando o ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Configure as variáveis de ambiente conforme necessário.

---

### Executando localmente (sem Docker)

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:

```env
REACT_APP_API=http://localhost:5000
HOME_URL=http://localhost:3000
```

> **Observação:** Caso o backend esteja sendo executado através do Docker Compose, utilize `http://localhost:5001` como valor para `REACT_APP_API`.

Inicie a aplicação:

```bash
npm start
```

Após a inicialização, o frontend estará disponível em:

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |

---

### Executando com Docker

Para executar o ambiente completo da aplicação, utilize o arquivo `docker-compose.yml` disponível no repositório do backend.

No diretório do backend execute:

```bash
docker compose up --build
```

Serão iniciados automaticamente os seguintes serviços:

- PostgreSQL
- Backend
- Frontend

Após a inicialização, a aplicação estará disponível em:

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |

---

## Variáveis de Ambiente

| Variável | Descrição | Valor padrão |
|----------|-----------|---------------|
| REACT_APP_API | URL da API | http://127.0.0.1:5000 |
| HOME_URL | URL da aplicação | http://127.0.0.1:3000 |

> **Observação:** Quando o backend for executado através do Docker Compose, utilize `http://127.0.0.1:5001` como valor para `REACT_APP_API`.

---

## Estrutura do Projeto

```text
src/
├── assets/          # Imagens, ícones e arquivos estáticos
├── components/      # Componentes reutilizáveis da interface
├── contexts/        # Contextos globais da aplicação
├── hooks/           # Hooks customizados para acesso à API e gerenciamento de estado
├── pages/           # Páginas da aplicação
├── routes/          # Configuração das rotas
├── utils/           # Funções utilitárias
├── __tests__/       # Testes unitários
├── api.js           # Configuração da comunicação com a API
├── App.js           # Componente principal
└── index.js         # Ponto de entrada da aplicação
```

---

## Testes

Execute os testes com:

```bash
npm test
```

---

## Padronização de Código

O projeto utiliza **ESLint** e **Prettier** para padronização do código.

No Visual Studio Code recomenda-se habilitar a formatação automática adicionando as seguintes configurações:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

---

## Como contribuir

1. Faça um fork do repositório.

2. Crie uma branch para sua funcionalidade:

```bash
git checkout -b feature/minha-feature
```

3. Realize as alterações desejadas.

4. Faça o commit:

```bash
git commit -m "feat: descrição da funcionalidade"
```

5. Envie a branch para o seu fork:

```bash
git push origin feature/minha-feature
```

6. Abra um Pull Request.

---

## Licença

Projeto desenvolvido no âmbito da Universidade Federal da Bahia (UFBA).

A definição da licença permanece pendente.