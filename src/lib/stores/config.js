import { writable } from 'svelte/store'
import config_model from './config.json'
import {httpAPI} from '../api.js'

function createConfigStore() {
    const P  = writable(config_model)
    const { subscribe, set, update } = P

	async function download() {
        let res = await httpAPI("GET", "/config")
        P.update(() => res)
        return P
	}
    

    return {
        subscribe,
        set,
        update,
        download
    }
}

export const config_store = createConfigStore()