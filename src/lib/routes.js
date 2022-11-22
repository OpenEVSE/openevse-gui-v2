import Main             from '../routes/Main.svelte'
import Schedule         from '../routes/Schedule.svelte'
import Monitoring       from '../routes/Monitoring.svelte'
import System           from '../routes/System.svelte'
import Services         from '../routes/Services.svelte'
import Configuration    from '../routes/Configuration.svelte'
import NotFound         from '../routes/NotFound.svelte'
import History             from '../routes/History.svelte'

export const routes = {
    // Exact path
    '/': Main,
    '/schedule': Schedule,
    '/monitoring': Monitoring,
    '/history': History,
    '/configuration': Configuration,
    '/configuration/system': System,
    '/configuration/services': Services,
    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}