import { writable } from 'svelte/store'
import config_fakedata from './config.json'
import {httpAPI} from '../utils.js'

function createConfigStore() {
    const P  = writable(config_fakedata)
    const { subscribe, set, update } = P

	async function download() {
		P.update(() => config_fakedata)
		await new Promise(resolve => setTimeout(resolve, 500));
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