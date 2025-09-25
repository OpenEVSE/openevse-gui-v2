# GitHub Copilot Instructions for OpenEVSE GUI v2

## Project Overview
OpenEVSE GUI v2 is a modern web-based user interface for the OpenEVSE WiFi module, built with Svelte and Vite. This is the second generation of the OpenEVSE web interface, providing a responsive and intuitive way to configure and monitor OpenEVSE electric vehicle charging stations.

## Architecture & Technology Stack
- **Frontend Framework**: Svelte 4.x
- **Build Tool**: Vite 4.x  
- **CSS Framework**: Bulma CSS
- **Language**: JavaScript (ES modules)
- **Internationalization**: svelte-i18n
- **Routing**: svelte-spa-router
- **Icons**: Iconify
- **PWA Support**: vite-plugin-pwa

## Project Structure
```
src/
├── components/           # Reusable Svelte components
│   ├── blocks/          # Page-specific component blocks
│   │   ├── configuration/  # Configuration page components
│   │   └── main/          # Main page components
│   ├── help/            # Help documentation components
│   └── ui/              # Generic UI components
├── lib/                 # Core application logic
│   ├── stores/          # Svelte stores for state management
│   └── routes.js        # Application routing configuration
├── routes/              # Page-level route components
└── App.svelte           # Root application component
```

## Development Setup
1. **Prerequisites**: Node.js and npm
2. **Submodules**: Always run `git submodule update --init --recursive` after cloning
3. **Installation**: `npm install`
4. **Development**: `npm run dev` (serves on http://localhost:5173)
5. **Build**: `npm run build`
6. **Environment**: Set `VITE_OPENEVSEHOST` in `.env` (defaults to openevse.local)

## Code Style & Conventions

### File Naming
- Components: PascalCase (e.g., `InputForm.svelte`)
- Routes: PascalCase matching component names
- Stores: lowercase with underscores (e.g., `config_store.js`)
- Utilities: camelCase

### Component Structure
- Use `<script>`, `<style>`, and template sections in Svelte components
- Import statements at the top of `<script>` section
- Export props and define reactive statements
- Keep component-specific styles in `<style>` sections

### State Management
- Use Svelte stores for shared state (located in `src/lib/stores/`)
- Store names follow pattern: `{domain}_store` (e.g., `config_store`, `status_store`)
- Import stores with destructuring: `import { config_store } from '../lib/stores/config.js'`

### Routing
- Routes defined in `src/lib/routes.js`
- Route components in `src/routes/` directory
- Use `CentralView` component as layout wrapper

### Styling
- Bulma CSS classes for styling
- Custom styles in `src/mystyles.scss`
- Component-specific styles scoped within component `<style>` tags
- Use Bulma utility classes for responsive design

### Internationalization
- All user-facing text should use `svelte-i18n`: `$_("key.path")`
- Translation keys organized hierarchically (e.g., `config.titles.dev`)
- Language files in root directory (e.g., `en.json`, `fr.json`)

## API Integration
- API calls proxy through Vite dev server (`/api` routes)
- WebSocket connections for real-time updates (`/ws` routes)
- Target host configurable via `VITE_OPENEVSEHOST` environment variable

## Key Features to Understand
1. **Configuration Management**: Multiple configuration screens for different aspects (MQTT, Network, Safety, etc.)
2. **Real-time Monitoring**: Live status updates via WebSocket
3. **RAPI Commands**: Direct communication with OpenEVSE hardware via RAPI protocol (Rapid API)
4. **PWA Support**: Installable web app with offline capabilities
5. **Multi-language Support**: Full internationalization
6. **Vehicle Integration**: Tesla API integration and generic vehicle support
7. **Energy Management**: Solar/self-production integration, demand shaping
8. **Safety Features**: Ground fault detection, temperature monitoring, stuck relay detection
9. **Certificate Management**: SSL/TLS certificate handling for secure connections
10. **Scheduler**: Time-based charging scheduling with different time zones

## Domain-Specific Knowledge

### OpenEVSE Hardware
- OpenEVSE is an open-source Electric Vehicle Supply Equipment (EVSE) / charging station
- Controls charging current, safety monitoring, and communication protocols
- Supports both Level 1 (120V) and Level 2 (240V) charging
- Hardware includes current transformers, relays, temperature sensors, and GFCI protection

### RAPI Protocol
- **RAPI** = Rapid API, a simple serial protocol for OpenEVSE communication
- Commands prefixed with `$` (e.g., `$GE` for get settings, `$SC` for set current)
- Used for real-time control and status monitoring
- See `DevHelp.svelte` for comprehensive RAPI command reference

### Charging States
- State A: No vehicle connected
- State B: Vehicle connected, not ready
- State C: Vehicle connected and ready
- State D: Charging with ventilation required
- Error states for various fault conditions

### Energy Integration
- **Solar/Self-production**: Divert excess solar energy to EV charging
- **Demand Response**: Integration with utility programs (OhmConnect)
- **Load Balancing**: Manage multiple EVSEs on shared electrical service

## Common Development Patterns

### Creating New Configuration Pages
1. Create component in `src/components/blocks/configuration/`
2. Create route component in `src/routes/`
3. Add route to `src/lib/routes.js`
4. Add translations for any new text

### Adding New Stores
1. Create store file in `src/lib/stores/`
2. Export writable store with initial state
3. Import and use in components with `$store_name` syntax

### Working with Forms
- Use `InputForm`, `Switch`, `Button` components from `src/components/ui/`
- Bind form values to component state
- Handle form submission with custom functions

## Build Considerations
- Build process includes multiple warnings about deprecated Sass functions (can be ignored)
- PWA manifest and service worker generated automatically
- Assets optimized and compressed in production build
- Supports legacy browser compatibility via Vite plugin

## Testing & Debugging
- No automated test suite currently implemented
- Manual testing via development server (`npm run dev`)
- Cross-browser compatibility important for embedded device deployment
- **Hardware Testing**: Test with actual OpenEVSE hardware when possible
- **API Mocking**: Use development proxy to connect to OpenEVSE device or mock API
- **Mobile Testing**: Interface must work on tablets and phones used in garage/outdoor environments
- **Network Resilience**: Handle intermittent WiFi connections gracefully
- **RAPI Testing**: Use Dev page (`/configuration/dev`) to send raw RAPI commands for debugging

## Deployment
- Builds to static files in `dist/` directory  
- Designed to run on OpenEVSE WiFi module (ESP32-based)
- Assets served statically, API calls proxied to device backend
- Memory constraints: Keep bundle size reasonable for ESP32 deployment
- **File System**: Uses LittleFS on ESP32, limited storage space

## Common Issues & Troubleshooting

### Build Issues
- **Submodule Error**: Always run `git submodule update --init --recursive` after cloning
- **Sass Warnings**: Deprecated Sass function warnings can be ignored (Bulma dependency)
- **Memory**: Large bundles may cause ESP32 memory issues - monitor build output sizes

### Runtime Issues  
- **CORS**: Development server proxies API calls to avoid CORS issues
- **WebSocket**: Real-time features depend on stable WebSocket connection
- **Timezone**: Time zone data loaded from submodule, affects scheduling features
- **Certificate**: HTTPS issues may prevent secure WebSocket connections

### Device Integration
- **Network**: ESP32 device must be on same network or accessible via proxy
- **Firmware**: GUI version should match OpenEVSE firmware capabilities
- **RAPI**: Command failures may indicate firmware/hardware issues

## Contributing Guidelines
- Follow existing code style and component patterns
- Test changes with `npm run dev` and `npm run build`
- Ensure responsive design works on mobile devices
- Consider accessibility when adding new UI components
- All text should be internationalized from the start