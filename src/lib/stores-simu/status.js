import { writable } from 'svelte/store'
import status_model from '../models/status.json'

function createStatusStore() {
    const P  = writable(status_model)
    const { subscribe, set, update } = P

	async function download() {
		const response = await new Promise(() => setTimeout( () => {
		}, 2000))
			return response
	}
    

    return {
        subscribe,
        set,
        update,
        download
    }
}

export const status_store = createStatusStore()