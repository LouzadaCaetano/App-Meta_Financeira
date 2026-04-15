# 📱 Aplicativo de Controle de Dieta

## 📌 Objetivo da aplicação

Este projeto consiste em um aplicativo mobile desenvolvido com **React Native** que permite ao usuário **registrar e acompanhar suas refeições diárias**, auxiliando no controle de uma dieta.

A aplicação possibilita que o usuário **cadastre, visualize, edite e exclua refeições**, além de acompanhar **estatísticas relacionadas ao progresso da dieta**.

O objetivo principal é fornecer uma forma simples de registrar refeições e verificar se elas estão **dentro ou fora da dieta**, incentivando o acompanhamento alimentar.

---

## ⚙️ Tecnologias utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

* **React Native**
* **Expo**
* **TypeScript**
* **React Navigation (Native Stack)**
* **Styled-components**
* **AsyncStorage**

---

## 📱 Funcionalidades da aplicação

A aplicação possui as seguintes funcionalidades principais:

* Cadastro de refeições contendo:

  * Nome
  * Descrição
  * Data
  * Horário
  * Indicação se está dentro ou fora da dieta

* Visualização da lista de refeições organizadas por data

* Tela de detalhes da refeição, permitindo:

  * Visualizar todas as informações
  * Editar a refeição
  * Excluir a refeição (com confirmação)

* Tela de feedback após cadastro da refeição:

  * **“Continue assim!”** para refeições dentro da dieta
  * **“Que pena!”** para refeições fora da dieta

* Tela de estatísticas mostrando:

  * Percentual de refeições dentro da dieta
  * Percentual de refeições fora da dieta
  * Quantidade total de refeições registradas

* Persistência dos dados utilizando **armazenamento local no dispositivo**

---

## ▶️ Como executar o projeto

### 1️⃣ Clonar o repositório

```bash
git clone <url-do-repositorio>
```

---

### 2️⃣ Acessar a pasta do projeto

```bash
cd nome-do-projeto
```

---

### 3️⃣ Instalar as dependências

```bash
npm install
```

ou

```bash
yarn
```

---

### 4️⃣ Executar o projeto

Para iniciar o aplicativo com Expo:

```bash
npx expo start
```

Após executar o comando, será aberto o **Expo Developer Tools** no navegador.

Você poderá rodar o aplicativo utilizando:

* **Emulador Android**
* **Simulador iOS**
* **Aplicativo Expo Go no celular**

---

## 📱 Executar no celular com Expo Go

1. Instale o aplicativo **Expo Go** no seu celular.
2. Execute `npx expo start`.
3. Escaneie o **QR Code** exibido no terminal ou navegador.

O aplicativo será carregado diretamente no seu dispositivo.

---

## 📌 Observações

* Os dados das refeições são armazenados localmente utilizando **AsyncStorage**.
* Não é necessário backend ou banco de dados externo.
* Todas as informações permanecem salvas no dispositivo do usuário.

---
