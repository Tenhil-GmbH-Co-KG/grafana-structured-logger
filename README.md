<div align="center">
  <h1>Grafana Structured Logger</h1>
  <p>
    Lightweight structured logger for Node services on k8s. Emits JSON logs Grafana can parse reliably.
  </p>
  <p>
    <span>
      <img src="https://img.shields.io/badge/language-TypeScript-3078c6" alt="language">
    </span>
    <span>
      <img src="https://img.shields.io/badge/runtime-Node.js-43853d" alt="runtime">
    </span>
    <span>
      <img src="https://img.shields.io/badge/type-backend-lightgray" alt="type">
    </span>
    <span>
      <img src="https://img.shields.io/badge/tested%20with-Vitest-6E9F18" alt="tested with vitest">
    </span>
  </p>
</div>
<br/>

# Logging

Lightweight structured logger for Node services. Emits JSON logs that Grafana can parse reliably.

This library wraps native `console` methods (`debug`, `info`, `warn`, `error`, `critical`) and provides structured logs with optional labels and user information.

---

## Features

- Functional API
- Supports log levels: `debug`, `info`, `warning`, `error`, `critical`
- Emits **JSON lines** suitable for parsing in Grafana
- Lightweight, zero-dependency

---

## Installation

This package is hosted on **GitHub Packages** under the `@tenhil` scope.  
You can install it alongside normal npm packages (React, lodash, etc.) without overriding the default npm registry.

### 1. Authenticate with GitHub Packages

Run this once (replace `USERNAME` with your GitHub username, and use a Personal Access Token as your password):

```bash
npm login --scope=@tenhil --registry=https://npm.pkg.github.com

```

Your token only needs the scope:

- `read:packages`

### 2. Configure your project

Create or update a `.npmrc` file in your project root and add:

```ini
@tenhil:registry=https://npm.pkg.github.com

```

This ensures that only @tenhil/\* packages are pulled from GitHub’s registry.
All other packages will still be fetched from the **public npm registry** as usual.

### 3. Install the package

```bash
# Using npm
npm install @tenhil/grafana-structured-logger

# Using yarn
yarn add @tenhil/grafana-structured-logger

```

### 4. Usage in CI/CD

When installing in a pipeline, you must provide a token.
For pipelines outside GitHub, create a PAT with `read:packages` scope and store it as a secret.

```bash
# GitLab CI example
npm config set //npm.pkg.github.com/:_authToken=${CI_GITHUB_TOKEN}

```

## Example Usage

Example usage when consumed in other projects.

```typescript
import { info, warn, error, critical } from '@tenhil/grafana-structured-logger';

// Simple log
info('Service started');

// With structured data
info('User logged in', { userId: '1234', role: 'admin' });

// Warnings and errors
warn('Disk space running low', { disk: '/dev/sda1', available: '2GB' });
error('Database connection failed', { host: 'db.internal', retry: true });

// Critical errors
critical('Out of memory', { service: 'payment-processor' });
```

Expected output (example only).

```JSON
{
  "level": "info",
  "message": "User logged in",
  "timestamp": "2025-09-05T12:34:56.789Z",
  "userId": "1234",
  "role": "admin"
}

```
