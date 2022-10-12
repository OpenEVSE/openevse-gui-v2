import { writable } from 'svelte/store'
import status_model from '../models/status.json'

function createStatusStore() {
    const P  = writable(status_model)
    const { subscribe, set, update } = P

	async function download() {
		await new Promise(resolve => setTimeout(resolve, 2000));
	}
    

    return {
        subscribe,
        set,
        update,
        download
    }
}

export const status_store = createStatusStore()