import { writable } from 'svelte/store'
import plan_fakedata from './plan.json'

function createPlanStore() {
    const P  = writable(plan_fakedata)
    const { subscribe, set, update } = P

	async function download() {
		P.update(() => plan_fakedata)
		await new Promise(resolve => setTimeout(resolve, 500));
	}
    

    return {
        subscribe,
        set,
        update,
        download
    }
}

export const plan_store = createPlanStore()