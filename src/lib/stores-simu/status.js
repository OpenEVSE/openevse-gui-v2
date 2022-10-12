import { writable } from 'svelte/store'
import status_model from '../models/status.json'
import status_fakedata from './status.json'

function createStatusStore() {
    const P  = writable(status_model)
    const { subscribe, set, update } = P

	async function download() {
        P.update(status_fakedata)
        console.log(P)
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