# Habit Tracker (Offline-First)

Um aplicativo de rastreamento de hábitos moderno, focado em performance (offline-first) e gamificação, monorepo com suporte a Web e Mobile.

## 🛠 Tecnologias

- **Gerenciamento:** Turborepo
- **Mobile:** React Native (Expo) + NativeWind (Tailwind)
- **Web:** Next.js + TailwindCSS
- **Dados:** WatermelonDB (SQLite no Mobile, LokiJS na Web)
- **Estado:** Zustand

## 🚀 Como Rodar o Projeto

Este projeto utiliza **npm** e **Turborepo**. Certifique-se de ter o Node.js instalado.

### 1. Instalação

Na raiz do projeto, instale todas as dependências:

```bash
npm install
```

### 2. Rodar Aplicações

#### Web (Next.js)
Para rodar o site em `localhost:3000`:

```bash
npm run dev --filter=web
# ou entre na pasta: cd apps/web && npm run dev
```

#### Mobile (Expo)
Para rodar o app no seu emulador (iOS Simulator / Android Emulator) ou dispositivo físico (via Expo Go):

```bash
# Iniciar o servidor Expo
cd apps/mobile
npm run start
```
Uma vez iniciado o servidor metro:
- Pressione `i` para abrir no iOS Simulator.
- Pressione `a` para abrir no Android Emulator.
- Ou escaneie o QR Code com o app **Expo Go** no seu celular.

### 3. Comandos Úteis

- **`npm run dev`**: Roda tudo (Web + Mobile) simultaneamente (pode ser pesado).
- **`npm run build`**: Compila todos os pacotes e apps.

## 📱 Funcionalidades Atuais

- [x] Design System Compartilhado (Tailwind em ambos)
- [x] Banco de Dados Offline (Criação e Leitura de Hábitos)
- [x] Sincronização em Tempo Real (Reactive UI)
- [x] Gamificação Básica (Streaks e Confetti)
