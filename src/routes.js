import Main from './routes/Main.svelte'
import NotFound from './routes/NotFound.svelte'

export const routes = {
    // Exact path
    '/': Main,
    '/schedule*': Main,
    '/logs': Main,
    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}