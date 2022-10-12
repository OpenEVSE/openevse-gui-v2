import { writable } from 'svelte/store'
import status_fakedata from './status.json'

function createStatusStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download() {
        P.update(() => status_fakedata)
		await new Promise(resolve => setTimeout(resolve, 500));
	}
    

    return {
        subscribe,
        set,
        update,
        download
    }
}

export const status_store = createStatusStore()