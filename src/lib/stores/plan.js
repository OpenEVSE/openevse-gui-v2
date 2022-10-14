import { writable } from 'svelte/store'
import plan_model from './plan.json'
import {httpAPI} from '../api.js'

function createPlanStore() {
    const P  = writable(plan_model)
    const { subscribe, set, update } = P

	async function download() {
		let res = await httpAPI("GET", "/schedule/plan")
        P.update(() => res)
        return P
	}
    
    return {
        subscribe,
        set,
        update,
        download
    }
}

export const plan_store = createPlanStore()