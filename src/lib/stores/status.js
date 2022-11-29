import { writable } from 'svelte/store'
import {httpAPI} from '../utils.js'

function createStatusStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download() {
		let res = await httpAPI("GET", "/status")
        if (res && (res.msg != "error" && res != "error")) {
            P.update(() => res)
            return true
        } else {
            return false
        }
    }
    return {
        subscribe,
        set,
        update,
        download
    }
}

export const status_store = createStatusStore()