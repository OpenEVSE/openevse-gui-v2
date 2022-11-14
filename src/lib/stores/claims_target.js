import { get, writable } from 'svelte/store'
import {httpAPI} from '../utils.js'
const EvseClient_OpenEVSE_Manual = 65537 //Client ID we use for claims

function createClaimsTargetStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	// get claims/target
	async function download() {
        let target = await httpAPI("GET", "/claims/target");
        if (target.msg == "error") {
			target = {}
			P.update(() => target)
			return P
		}
		else {
			P.update(() => target)
            return P
		}
}

    return {
        subscribe,
		get: (s) => get(s), // little hack to access get() method inside the object itself
        set,
        update,
        download
    }
}

export const claims_target_store = createClaimsTargetStore()
