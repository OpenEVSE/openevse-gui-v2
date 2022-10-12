import { writable } from 'svelte/store'
import plan_model from '../models/plan.json'
import plan_fakedata from './plan.json'

function createPlanStore() {
    const P  = writable(plan_model)
    const { subscribe, set, update } = P

	async function download() {
		P.update(plan_fakedata)
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

export const status_store = createPlanStore()