# Next.js Express Server

Integrating Express into Next.js to allow things like self-hosting, web sockets, etc.

## Setup

Add `express` to project

```sh
pnpm add express
```

Add the types for express

```sh
pnpm add -D @types/express
```

Add `cross-env` to dev dependencies

> For cross-platform environment variable commands, ie. Non-bash environments

```sh
pnpm add -D cross-env
```

Add `nodemon` and `ts-node` to dev dependencies

```sh
pnpm add -D nodemon ts-node
```

Create `nodemon.json`

```json
{
  "watch": ["server.ts"],
  "exec": "ts-node --project tsconfig.server.json src/server.ts -- -I",
  "ext": "js ts",
  "stdin": false
}
```

Create `tsconfig.server.json` which will be the project config for the server

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "Node",
    "outDir": "dist",
    "noEmit": false,
    "jsx": "react"
  },
  "include": ["src/server.ts"]
}
```

Create `.env.local`

```.env
PORT=3000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Create `src/server.ts`

```ts
import express from "express";
import next from "next";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
const nextApp = next({
  dev: process.env.NODE_ENV !== "production",
});
const nextHandler = nextApp.getRequestHandler();

const start = async () => {
  // forward routes from express to nextjs
  app.use((req, res) => nextHandler(req, res));

  // Think it runs when the next app finishes startup
  nextApp.prepare().then(() => {
    // initialize express server to listen on port
    app.listen(PORT, async () => {
      console.log(`\n   ▲ Next.js App`);
      console.log(`   - Port:    ${process.env.PORT}`);
      console.log(`   - App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}\n`);
    });
  });
};

start();
```

Modify `package.json` with new scripts

```json
  "scripts": {
    "dev": "nodemon",
    "build:server": "tsc --project tsconfig.server.json", //new
    "build": "npm run build:server && next build", //new
    "start": "cross-env NODE_ENV=production node dist/server.js", //new
    "lint": "next lint"
  },
```

Add `dist` folder to `.gitignore` (Optional)

```
/dist
```
