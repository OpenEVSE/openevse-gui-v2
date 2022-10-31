import { writable } from 'svelte/store'
import {httpAPI} from '../api.js'

function createStatusStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download() {
		let res = await httpAPI("GET", "/status")
        P.update(() => res)
    }
    return {
        subscribe,
        set,
        update,
        download
    }
}

export const status_store = createStatusStore()