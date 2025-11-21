# 🧭 Fastify Lifecycle Overview

Fastify is a high-performance Node.js web framework built on a clear, event-driven lifecycle.
This document explains **every major phase and hook** of a Fastify application — from **server initialization** to **request handling** and **graceful shutdown**.

---

## 📋 Table of Contents

1. [Server Initialization](#-1-server-initialization)
2. [Plugin Registration Phase](#-2-plugin-registration-phase)
3. [Server Ready & Startup](#-3-server-ready--startup)
4. [Request Lifecycle (Per Request)](#-4-request-lifecycle-per-request)
5. [Error and Timeout Hooks](#-5-error-and-timeout-hooks)
6. [Server Shutdown Phase](#-6-server-shutdown-phase)
7. [Summary Flow Diagram](#-7-summary-flow-diagram)
8. [Reference Table](#-8-reference-table)

---

## ⚙️ 1. Server Initialization

When you call `fastify()`, a new Fastify instance is created.

```js
const fastify = require('fastify')();
```

**What happens internally:**

- A new encapsulation context is created.
- Default decorators, serializers, and content parsers are initialized.
- No routes or plugins are loaded yet.

There are **no hooks** executed at this point.

---

## 🧩 2. Plugin Registration Phase

When you call `fastify.register(plugin)`, Fastify begins a new **encapsulation scope**.
This is where plugin-level hooks and decorators live.

### 🔹 onRegister

- **Phase:** Plugin Registration
- **Runs:** Once per plugin registration
- **Async:** ✅
- **Purpose:** Modify or inspect the context _before_ the plugin function runs.
- **Example:**

  ```js
  fastify.addHook('onRegister', (instance, opts) => {
    console.log('Plugin registered:', instance.prefix);
  });
  ```

### 🔹 Plugin Execution

- The plugin function runs.
- Inside, you can add decorators, hooks, and routes.

### 🔹 onRoute

- **Phase:** Route Definition
- **Runs:** Once per route registration
- **Async:** ❌ (synchronous)
- **Purpose:** Observe or modify route configurations.
- **Example:**

  ```js
  fastify.addHook('onRoute', (route) => {
    console.log('New route added:', route.url);
  });
  ```

---

## 🚀 3. Server Ready & Startup

After all plugins and routes are registered, the app enters the ready phase.

### 🔹 onReady

- **Phase:** Server Ready
- **Runs:** Once, after all plugins loaded
- **Async:** ✅
- **Purpose:** Execute logic before server starts listening (e.g., DB warm-up).
- **Triggered by:** `await fastify.ready()`

### 🔹 onListen

- **Phase:** Server Startup
- **Runs:** Once per `fastify.listen()` call
- **Async:** ✅
- **Purpose:** Perform tasks after the server has successfully started (e.g., log binding info).

```js
fastify.addHook('onListen', async (server) => {
  console.log('Server listening on', server.address());
});
```

---

## 🌐 4. Request Lifecycle (Per Request)

Each incoming HTTP request follows this precise order of hooks:

```
onRequest
  ↓
preParsing
  ↓
preValidation
  ↓
preHandler
  ↓
Route Handler
  ↓
preSerialization
  ↓
onSend
  ↓
onResponse
```

Let’s look at each step.

---

### 🔹 onRequest

- **Phase:** Start of request
- **Runs:** Per request
- **Async:** ✅
- **Purpose:** Access raw `req`/`res`, log or modify headers, perform early auth checks.
- **Note:** Runs before body parsing.

---

### 🔹 preParsing

- **Phase:** Before body parsing
- **Runs:** Per request
- **Async:** ✅
- **Purpose:** Modify the raw request stream before parsing (e.g., decompressing).

---

### 🔹 preValidation

- **Phase:** Before schema validation
- **Runs:** Per request
- **Async:** ✅
- **Purpose:** Manipulate or add data before Fastify validates the request payload or params.

---

### 🔹 preHandler

- **Phase:** Before route handler execution
- **Runs:** Per request
- **Async:** ✅
- **Purpose:** Commonly used for authentication, authorization, or pre-fetching data.

---

### 🔹 Route Handler

- **Phase:** Business logic execution
- **Runs:** Per request
- **Async:** ✅
- **Purpose:** The user-defined handler produces the response payload.

---

### 🔹 preSerialization

- **Phase:** Before response serialization
- **Runs:** Per request
- **Async:** ✅
- **Purpose:** Modify or transform response payload before it’s serialized (e.g., mask data).

---

### 🔹 onSend

- **Phase:** Before sending response to client
- **Runs:** Per request
- **Async:** ✅
- **Purpose:** Alter response body or headers, add metadata, compress, etc.

---

### 🔹 onResponse

- **Phase:** After response is sent
- **Runs:** Per request
- **Async:** ✅
- **Purpose:** Final logging, analytics, resource cleanup.

---

## ⚠️ 5. Error and Timeout Hooks

Certain hooks run only during exceptional conditions.

### 🔹 onError

- **Runs:** When a hook, validation, or handler throws or rejects.
- **Async:** ✅
- **Purpose:** Customize error responses, logging, or telemetry.

### 🔹 onTimeout

- **Runs:** When a request exceeds timeout.
- **Async:** ✅
- **Purpose:** Handle timeout errors gracefully.

### 🔹 onRequestAbort

- **Runs:** When a client aborts the request.
- **Async:** ✅
- **Purpose:** Clean up streams or cancel database operations.

---

## 🛑 6. Server Shutdown Phase

When `fastify.close()` is called, Fastify gracefully tears down all resources.

### 🔹 onClose

- **Phase:** Teardown
- **Runs:** Once per plugin (in reverse registration order)
- **Async:** ✅
- **Purpose:** Release resources, close DB connections, stop timers, etc.
- **Example:**

  ```js
  fastify.addHook('onClose', async (instance) => {
    await instance.db.close();
  });
  ```

---

## 🔄 7. Summary Flow Diagram

```text
Server Initialization
   ↓
Plugin Registration
   ├─ onRegister
   ├─ plugin executes
   └─ onRoute (per route)
   ↓
Server Ready & Startup
   ├─ onReady
   └─ onListen
   ↓
Per Request Lifecycle
   ├─ onRequest
   ├─ preParsing
   ├─ preValidation
   ├─ preHandler
   ├─ Handler
   ├─ preSerialization
   ├─ onSend
   └─ onResponse
   (→ onError / onTimeout / onRequestAbort if triggered)
   ↓
Server Shutdown
   └─ onClose
```

---

## 📘 8. Reference Table

| Hook               | Phase               | Runs            | Async | Purpose                     |
| ------------------ | ------------------- | --------------- | ----- | --------------------------- |
| `onRegister`       | Plugin Registration | Once per plugin | ✅    | Modify encapsulated scope   |
| `onRoute`          | Route Definition    | Once per route  | ❌    | Inspect route config        |
| `onReady`          | Ready               | Once            | ✅    | Startup tasks               |
| `onListen`         | Startup             | Once per listen | ✅    | Post-bind logic             |
| `onRequest`        | Request Lifecycle   | Per request     | ✅    | Early request logic         |
| `preParsing`       | Request Lifecycle   | Per request     | ✅    | Modify raw body             |
| `preValidation`    | Request Lifecycle   | Per request     | ✅    | Before validation           |
| `preHandler`       | Request Lifecycle   | Per request     | ✅    | Before handler              |
| `preSerialization` | Request Lifecycle   | Per request     | ✅    | Modify response payload     |
| `onSend`           | Request Lifecycle   | Per request     | ✅    | Modify response before send |
| `onResponse`       | Request Lifecycle   | Per request     | ✅    | After response cleanup      |
| `onError`          | Error Lifecycle     | On error only   | ✅    | Custom error handling       |
| `onTimeout`        | Error Lifecycle     | On timeout      | ✅    | Handle timeouts             |
| `onRequestAbort`   | Error Lifecycle     | On abort        | ✅    | Cleanup on abort            |
| `onClose`          | Teardown            | Once per plugin | ✅    | Release resources           |

---

### 🧩 Notes

- All hooks can be **encapsulated**: they only apply to the scope (plugin or route) where they were defined.
- Hooks are executed in **registration order**, within the encapsulation hierarchy.
- Global hooks apply across all routes unless defined inside a plugin scope.
- All async hooks can return a Promise or use a `done()` callback.
