import Main from '../routes/Main.svelte'
import Schedule from '../routes/Schedule.svelte'
import Supervision from '../routes/Supervision.svelte'
import System from '../routes/System.svelte'
import NotFound from '../routes/NotFound.svelte'

export const routes = {
    // Exact path
    '/': Main,
    '/schedule*': Schedule,
    '/supervision': Supervision,
    '/config/system': System,
    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}