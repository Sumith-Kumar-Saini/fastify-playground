# 🚀 Fastify Playground

**Fastify Playground** is a hands-on learning project exploring the transition from **Express.js** to **Fastify** — focusing on performance, simplicity, and modern API design.  
The goal is to understand the practical differences, experiment with Fastify’s capabilities, and benchmark performance between the two frameworks.

---

## 📚 Overview

This repository demonstrates:

- Setting up a Fastify server using TypeScript
- Running and comparing **Express vs. Fastify** with automated performance tests
- Building, linting, and formatting using modern Node.js tooling
- Using **esbuild** for production-ready bundling

It’s a personal learning and experimentation space — building new skills, not just waiting for opportunities.

---

## 🧠 Tech Stack

- **Node.js** (v18+ recommended)
- **TypeScript**
- **Fastify 5**
- **Express 5**
- **Autocannon** (for performance benchmarking)
- **esbuild**
- **ESLint + Prettier**
- **Husky + lint-staged** (for pre-commit code quality)
- **dotenv** (for environment management)

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Sumith-Kumar-Saini/fastify-playground.git
cd fastify-playground
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

This starts the Fastify server via `ts-node` and watches for file changes with **nodemon**.

### 4. Environment variables

Create a `.env` file (optional):

```bash
PORT=3000
NODE_ENV=development
```

### 5. Build for production

```bash
npm run build
npm start
```

The project is bundled into the `dist` folder using **esbuild**.

---

## ⚡ Performance Testing

To compare **Express** and **Fastify**, run:

```bash
npm run test:performance
```

This uses **Autocannon** to benchmark both servers (`src/performance/express-server.ts` and `src/performance/fastify-server.ts`), printing results for requests per second, latency, and throughput.

---

## 🧩 Project Structure

```
fastify-playground/
├── src/
│   ├── server.ts                  # Main Fastify entry
│   └── performance/
│       ├── express-server.ts     # Express test server
│       ├── fastify-server.ts     # Fastify test server
│       └── index.ts              # Autocannon test runner
├── esbuild.config.mjs            # Build configuration
├── eslint.config.mjs             # Linting setup
├── nodemon.json                  # Dev server config
├── tsconfig.json                 # TypeScript settings
├── .prettierrc                   # Code formatting rules
├── .husky/                       # Git hooks (lint-staged)
└── package.json
```

---

## 💄 Code Quality

- **Linting:**

  ```bash
  npm run lint
  ```

- **Auto-fix issues:**

  ```bash
  npm run lint:fix
  ```

- **Format code:**

  ```bash
  npm run format
  ```

Pre-commit hooks automatically lint and format staged files via **Husky** and **lint-staged**.

---

## 🧪 Scripts Summary

| Command                    | Description                              |
| -------------------------- | ---------------------------------------- |
| `npm run dev`              | Start Fastify server in development      |
| `npm run build`            | Build project using esbuild              |
| `npm start`                | Run compiled server from `dist/`         |
| `npm run lint`             | Run ESLint checks                        |
| `npm run lint:fix`         | Auto-fix lint issues                     |
| `npm run format`           | Format code with Prettier                |
| `npm run test:performance` | Run Express vs Fastify performance tests |

---

## 📈 Learning Focus

This project is about **exploring**, **measuring**, and **growing** — learning Fastify’s modern patterns and its advantages over Express.
It’s not a production app; it’s a journey into better backend design and performance.

---

## 🧭 Developer Learning Resources

Enhance your understanding of Fastify with in-depth guides and documentation:

| Resource                                            | Description                                                                  |
| --------------------------------------------------- | ---------------------------------------------------------------------------- |
| 🗺️ [Fastify Roadmap](./docs/fastify-roadmap.md)     | Step-by-step learning path — from fundamentals to production-ready patterns. |
| 🔁 [Fastify Lifecycle](./docs/fastify-lifecycle.md) | Detailed overview of Fastify’s internal hooks, flow, and request lifecycle.  |

More guides will be added soon — covering **plugins**, **testing**, **error handling**, and **deployment**.

---

## 📜 License

MIT License © 2025 [Sumith Kumar Saini](https://github.com/Sumith-Kumar-Saini)

---

## 🌟 Acknowledgements

- [Fastify](https://www.fastify.io/)
- [Express.js](https://expressjs.com/)
- [Autocannon](https://github.com/mcollina/autocannon)
- [esbuild](https://esbuild.github.io/)

---

> “Keep building, keep learning — the best opportunities are the ones you create.” ✨
