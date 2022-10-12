import { writable } from 'svelte/store'
import config_fakedata from './config.json'

function createConfigStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download() {
		P.update(() => config_fakedata)
		await new Promise(resolve => setTimeout(resolve, 500));
	}

    return {
        subscribe,
        set,
        update,
        download
    }
}

export const config_store = createConfigStore()