# OpenEVSE-UI

New User Interface for OpenEVSE Wifi module

![image](https://user-images.githubusercontent.com/488789/235537900-f9ee2c65-d46f-4b92-b244-723a052c8bce.png)

 Framework: Svelte ( https://svelte.dev/ )  / Vite ( https://vitejs.dev/ )
 CSS Framework: Bulma ( https://bulma.io )

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## develop & test

set VITE_OPENEVSEHOST in .env ( default to openevse.local)

git submodule update --init --recursive

npm install

npm run dev

point your browser to http://localhost:5173

## build

npm run build

## Multiple Instance Development

For testing and development with multiple OpenEVSE devices/emulators simultaneously:

### Using Docker Compose (Recommended)

Run multiple GUI instances, each connected to a different OpenEVSE host:

```bash
docker-compose -f docker-compose.multi-instance.yml up
```

This starts three GUI instances:
- Instance 1: http://localhost:5173 → connects to openevse1.local
- Instance 2: http://localhost:5174 → connects to openevse2.local
- Instance 3: http://localhost:5175 → connects to openevse3.local

Edit `docker-compose.multi-instance.yml` to configure different hosts or add more instances.

### Running Multiple Instances Locally

To run multiple development servers on the same machine:

1. **First instance (terminal 1)**:
   ```bash
   cp .env.instance1.example .env
   npm run dev
   # Runs on http://localhost:5173
   ```

2. **Second instance (terminal 2)**:
   ```bash
   cp .env.instance2.example .env
   VITE_PORT=5174 npm run dev
   # Runs on http://localhost:5174
   ```

3. **Third instance (terminal 3)**:
   ```bash
   cp .env.instance3.example .env
   VITE_PORT=5175 npm run dev
   # Runs on http://localhost:5175
   ```

Each instance connects to a different OpenEVSE host configured in its .env file.

### Configuration Options

- `VITE_OPENEVSEHOST`: Target OpenEVSE device hostname or IP
- `VITE_PORT`: Port for the development server (default: 5173)

Example .env files for different instances are provided:
- `.env.instance1.example`
- `.env.instance2.example`
- `.env.instance3.example`
