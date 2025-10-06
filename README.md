# 🧩 Clean Node API

API modular desenvolvida em **Node.js** com **TypeScript** e **MongoDB**, baseada nos princípios de **Clean Architecture**, **SOLID**, **DDD (Domain-Driven Design)** e **TDD (Test-Driven Development)**.  
O projeto foi projetado para ser **escalável, testável e altamente manutenível**, seguindo padrões profissionais utilizados em aplicações de grande porte.

---

## ⚙️ Tecnologias Principais

| Tecnologia | Descrição |
|-------------|------------|
| **Node.js 22.x** | Plataforma de execução do backend. |
| **TypeScript** | Tipagem estática e segurança em tempo de desenvolvimento. |
| **Express.js** | Framework HTTP rápido e minimalista. |
| **MongoDB** | Banco de dados NoSQL para persistência de dados. |
| **JWT** | Autenticação segura baseada em tokens. |
| **bcrypt** | Criptografia de senhas de usuários. |
| **Swagger** | Documentação interativa da API. |
| **Docker** | Containerização e padronização de ambiente. |
| **Jest** | Framework de testes com suporte a TDD e cobertura. |
| **Supertest** | Testes de integração HTTP. |
| **ESLint + Husky + Lint-Staged** | Garantia de qualidade e padronização de código. |

---

## 🧱 Arquitetura do Projeto

A estrutura segue os princípios da **Clean Architecture**, isolando regras de negócio de detalhes de implementação.


Essa organização garante:
- **Independência tecnológica**
- **Baixo acoplamento e alta coesão**
- **Facilidade de manutenção e testes**

---

## 🔐 Funcionalidades

- **Cadastro e Login de Usuário (com JWT e bcrypt)**  
- **Criação, Listagem e Resposta de Enquetes**  
- **Resultado consolidado das Enquetes**  
- **Validação de entrada e tratamento global de erros**  
- **Middlewares para autenticação e permissões**  
- **Documentação de rotas via Swagger**  

---

## 🧪 Testes Automatizados

A base do projeto é guiada por **TDD (Test-Driven Development)**.  
Foram implementados testes **unitários** e **de integração** com **Jest** e **Supertest**, garantindo robustez e confiabilidade.

### Scripts de Teste

| Comando | Descrição |
|----------|------------|
| `npm test` | Executa todos os testes silenciosamente. |
| `npm run test:verbose` | Executa os testes com logs detalhados. |
| `npm run test:unit` | Executa apenas os testes unitários. |
| `npm run test:integration` | Executa apenas os testes de integração. |
| `npm run test:ci` | Executa todos os testes com relatório de cobertura. |

> 💡 Durante os commits, o **Husky** e o **lint-staged** garantem que o código passe nos testes e na formatação antes de ser versionado.

---

## 🧹 Qualidade de Código e Padronização

O projeto utiliza **ESLint**, **Husky** e **Lint-Staged** para manter o código limpo e evitar commits com erros ou estilo incorreto.

### Configuração
- **ESLint**: valida e corrige problemas automaticamente (`npm run lint`).
- **Husky**: executa scripts antes de commits/pushes.
- **Lint-Staged**: aplica ESLint e testes apenas aos arquivos alterados.

