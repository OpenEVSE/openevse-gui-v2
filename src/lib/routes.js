import Main             from '../routes/Main.svelte'
import Schedule         from '../routes/Schedule.svelte'
import Monitoring       from '../routes/Monitoring.svelte'
import Configuration    from '../routes/Configuration.svelte'
import NotFound         from '../routes/NotFound.svelte'
import History          from '../routes/History.svelte'
import RFID             from '../routes/RFID.svelte'
import Safety           from '../routes/Safety.svelte'
import Evse             from '../routes/Evse.svelte'
import MQTT             from '../routes/MQTT.svelte'
import HTTP             from '../routes/HTTP.svelte'
import OCPP             from '../routes/OCPP.svelte'
import Network          from '../routes/Network.svelte'
import Firmware         from '../routes/Firmware.svelte'
import Time             from '../routes/Time.svelte'
import Shaper           from '../routes/Shaper.svelte'
import SelfProduction   from '../routes/SelfProduction.svelte'
import EmonCMS          from '../routes/EmonCMS.svelte'
import OhmConnect       from '../routes/OhmConnect.svelte'
import Vehicle          from '../routes/Vehicle.svelte'
import Dev              from '../routes/Dev.svelte'
import About            from '../routes/About.svelte'
import Wizard           from '../routes/Wizard.svelte'


export const routes = {
    '/': Main ,
    '/schedule': Schedule,
    '/monitoring': Monitoring,
    '/history': History,
    '/configuration':Configuration,
    '/configuration/rfid':RFID,
    '/configuration/safety': Safety,
    '/configuration/evse': Evse,
    '/configuration/mqtt': MQTT,
    '/configuration/http': HTTP,
    '/configuration/ocpp': OCPP,
    '/configuration/network': Network,
    '/configuration/firmware': Firmware,
    '/configuration/time': Time,
    '/configuration/shaper': Shaper,
    '/configuration/selfproduction': SelfProduction,
    '/configuration/vehicle': Vehicle,
    '/configuration/emoncms': EmonCMS,
    '/configuration/ohmconnect': OhmConnect,
    '/configuration/dev': Dev,
    '/configuration/about': About,
    '/wizard/:step?':Wizard,
    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}