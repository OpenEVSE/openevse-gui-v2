import { writable } from 'svelte/store'
import {httpAPI} from '../utils.js'

function createScheduleStore() {
    const P  = writable([])
    const { subscribe, set, update } = P

	async function download() {
            let res = await httpAPI("GET", "/schedule")
            if (res && (res.msg != "error" && res != "error")) {
                for ( let t = 0; t < res.length ; t++) {
                    res[t].time = res[t].time.slice(0,5) // remove useless seconds
                }
                P.update(() => res)
                return true
            }
            else return false
	}

    async function upload(data) {
        let res = await httpAPI("POST", "/schedule",JSON.stringify(data))
        if (res.msg == "done")
            return true
        else return false
    }

    async function remove(id) {
        let res = await httpAPI("DELETE", "/schedule/" + id)
        if (res.msg == "done")
            return true
        else return false
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