import { writable, get } from 'svelte/store'
import {httpAPI, dedup} from '../utils.js'

function createHistoryStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download(index) {
		let res = await httpAPI("GET", "/logs/" + index)
        if (res && (res.msg != "error" && res != "error")) {
			let prevData = get(P)
			if (prevData) {
                let newData = [...prevData, ...res]
                let cleanData = dedup(newData)
                // sorting data
                // @ts-ignore
                cleanData.sort((a, b) => new Date(b.time) - new Date(a.time));
            	P.update(() => cleanData)
			}
			else {
                P.update(() => res)
            }
            return true
        }
        else return false
	}
    
    return {
        subscribe,
        set,
		get: (s) => get(s), // little hack to access get() method inside the object itself
        update,
        download: (index) => download(index)
    }
}

export const history_store = createHistoryStore()