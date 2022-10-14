import { writable } from 'svelte/store'
import {httpAPI} from '../api.js'

function createScheduleStore() {
    const P  = writable([])
    const { subscribe, set, update } = P

	async function download() {
            let res = await httpAPI("GET", "/schedule")
            for ( let t = 0; t < res.length ; t++) {
                res[t].time = res[t].time.slice(0,5) // remove useless seconds
            }
            P.update(() => res)
            return P
	}

    async function upload(data) {
        let res = await httpAPI("POST", "/schedule",JSON.stringify(data))
        const json_response = await res.json()
        return P
    }

    async function remove(id) {
        let res = await httpAPI("DELETE", "/schedule/" + id)
        return P
    }

    return {
        subscribe,
        set,
        update,
        download,
        remove: (id) => remove(id),
        upload: (schedule) => upload(schedule)
    }
}

export const schedule_store = createScheduleStore()