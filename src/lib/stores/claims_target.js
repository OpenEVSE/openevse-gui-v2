import "./../../lib/vars.js"
import { get, writable }    from 'svelte/store'
import {httpAPI}            from '../utils.js'
import model                from './json/claims_target.json'

function createClaimsTargetStore() {
    const P  = writable(model)
    const { subscribe, set, update } = P

	// get claims/target
	async function download() {
        let res = await httpAPI("GET", "/claims/target");
        if (res.msg == "error" || res == "error") {
			res = {}
			P.update(() => res)
			return false
		}
		else {
			P.update(() => res)
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
