import { wrap }         from 'svelte-spa-router/wrap'
import Main             from '../routes/Main.svelte'
import Schedule         from '../routes/Schedule.svelte'
import Monitoring       from '../routes/Monitoring.svelte'
import Services         from '../routes/Services.svelte'
import Configuration    from '../routes/Configuration.svelte'
import NotFound         from '../routes/NotFound.svelte'
import History          from '../routes/History.svelte'
import RFID             from '../routes/RFID.svelte'
import Safety           from '../routes/Safety.svelte'
import MQTT             from '../routes/MQTT.svelte'
import HTTP             from '../routes/HTTP.svelte'
import Network          from '../routes/Network.svelte'
import Firmware         from '../routes/Firmware.svelte'
import Time             from '../routes/Time.svelte'
import Unballaster      from '../routes/Unballaster.svelte'
import SelfProduction   from '../routes/SelfProduction.svelte'
import EmonCMS          from '../routes/EmonCMS.svelte'
import OhmConnect       from '../routes/OhmConnect.svelte'
import Vehicle          from '../routes/Vehicle.svelte'

export const routes = {
    // Exact path
    '/': wrap({ component: Main }),
    '/schedule': wrap({ component: Schedule}),
    '/monitoring': wrap({ component: Monitoring}),
    '/history': wrap({ component: History}),
    '/configuration': wrap({ component: Configuration}),
    '/configuration/services': wrap({ component: Services}),
    '/configuration/rfid': wrap({ component: RFID}),
    '/configuration/safety': wrap({ component: Safety}),
    '/configuration/mqtt': wrap({ component: MQTT}),
    '/configuration/http': wrap({ component: HTTP}),
    '/configuration/network': wrap({ component: Network}),
    '/configuration/firmware': wrap({ component: Firmware}),
    '/configuration/time': wrap({ component: Time}),
    '/configuration/unballaster': wrap({ component: Unballaster}),
    '/configuration/selfproduction': wrap({ component: SelfProduction}),
    '/configuration/vehicle': wrap({ component: Vehicle}),
    '/configuration/emoncms': wrap({ component: EmonCMS}),
    '/configuration/ohmconnect': wrap({ component: OhmConnect}),
    // '/configuration/dev': wrap({ component: Developper}),
    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}