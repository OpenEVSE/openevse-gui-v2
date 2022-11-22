import  "./../../lib/vars.js"
import { get, writable } from 'svelte/store'
import {httpAPI} from '../utils.js'

function createClaimsTargetStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	// get claims/target
	async function download() {
        await new Promise(resolve => timeout = setTimeout(resolve, 500));
			return P
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
