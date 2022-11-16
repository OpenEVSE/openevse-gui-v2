import  "./../../lib/vars.js"
import { get, writable } from 'svelte/store'
import {httpAPI} from '../utils.js'

function createClaimsTargetStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	// get claims/target
	async function download() {
        let target = await httpAPI("GET", "/claims/target");
        if (target.msg == "error") {
			target = {}
			P.update(() => target)
			return false
		}
		else {
			P.update(() => target)
            return true
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
