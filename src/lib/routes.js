import Main from '../routes/Main.svelte'
import Supervision from '../routes/Supervision.svelte'
import System from '../routes/System.svelte'
import NotFound from '../routes/NotFound.svelte'
import Test from '../routes/Test.svelte'

export const routes = {
    // Exact path
    '/': Main,
    '/test': Test,
    '/supervision': Supervision,
    '/config/system': System,
    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}