import Main from '../routes/Main.svelte'
import Schedule from '../routes/Schedule.svelte'
import Supervision from '../routes/Supervision.svelte'
import NotFound from '../routes/NotFound.svelte'

export const routes = {
    // Exact path
    '/': Main,
    '/schedule*': Schedule,
    '/supervision': Supervision,
    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}