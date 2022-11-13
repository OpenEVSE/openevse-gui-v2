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

    async function saveParam(attr,val) {
        return true
    }

    async function upload(data) {
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return {
        subscribe,
        set,
        update,
        download,
        upload: (data) => upload(data),
        saveParam: (attr,val) => saveParam(attr,val)
    }
}

export const config_store = createConfigStore()