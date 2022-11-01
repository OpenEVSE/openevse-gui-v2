import { writable } from 'svelte/store'
import {httpAPI} from '../utils.js'

function createConfigStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download() {
        let res = await httpAPI("GET", "/config")
        P.update(() => res)
        return P
	}

    async function setConfig(attr,val) {
        let data = '{ "' + attr + '": "' + val + '"}'
        let res = await httpAPI("POST", "/config", data)
        return res
    }
    

    return {
        subscribe,
        set,
        update,
        download,
        setConfig: (attr,val) => setConfig(attr,val)
    }
}

export const config_store = createConfigStore()