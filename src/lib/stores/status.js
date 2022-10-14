import { writable } from 'svelte/store'
import status_model from './status.json'
import {httpAPI} from '../api.js'

function createStatusStore() {
    const P  = writable(status_model)
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