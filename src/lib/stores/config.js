import { writable } from 'svelte/store'
import config_model from './config.json'
function createConfigStore() {
    const P  = writable(config_model)
    const { subscribe, set, update } = P

	async function download() {
		const response = await fetch('/config')
            if(response.ok) {
                const json_response = await response.json()		
                P.update(() => json_response)
                return P
            }
            throw Error(response.statusText)
	}
    

    return {
        subscribe,
        set,
        update,
        download
    }
}

export const config_store = createConfigStore()