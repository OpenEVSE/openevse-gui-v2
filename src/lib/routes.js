import Main from '../routes/Main.svelte'
import Supervision from '../routes/Supervision.svelte'
import System from '../routes/System.svelte'
import Services from '../routes/Services.svelte'
import Configuration from '../routes/Configuration.svelte'
import NotFound from '../routes/NotFound.svelte'
import Logs from '../routes/Logs.svelte'

export const routes = {
    // Exact path
    '/': Main,
    '/supervision': Supervision,
    '/logs': Logs,
    '/configuration': Configuration,
    '/configuration/system': System,
    '/configuration/services': Services,
    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}