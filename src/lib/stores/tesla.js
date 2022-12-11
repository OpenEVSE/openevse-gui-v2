import { writable } from 'svelte/store'
import {httpAPI} from '../utils.js'

function createTeslaStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download() {
		let res = await httpAPI("GET", "/tesla/vehicles")
        if (res && (res.msg != "error" && res != "error")) {
            P.update(() => res)
            return true
        }
        else return false
	}
    
    return {
        subscribe,
        set,
        update,
        download
    }
}

export const tesla_store = createTeslaStore()