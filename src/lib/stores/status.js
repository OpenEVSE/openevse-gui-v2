import { writable } from 'svelte/store'
import status_model from '../models/status.json'

function createStatusStore() {
    const P  = writable(status_model)
    const { subscribe, set, update } = P

	async function download() {
		const response = await fetch('/status')
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

export const status_store = createStatusStore()