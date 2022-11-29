import { writable } from 'svelte/store'
import {httpAPI} from '../utils.js'

function createPlanStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download() {
		let res = await httpAPI("GET", "/schedule/plan")
        if (res && (res.msg != "error" && res != "error")) {
            P.update(() => res)
            return true
        }
        else return false
	}
    
    return {
        subscribe,
        set,
        update,
        download
    }
}

export const plan_store = createPlanStore()