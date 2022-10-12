import { writable } from 'svelte/store'
import schedule_fakedata from './schedule.json'

export function createScheduleStore() {
	const P  = writable(schedule_fakedata)
    const { subscribe, set, update } = P
	
	async function download() {
		await new Promise(resolve => setTimeout(resolve, 500));
	}

	async function upload(sched) {
		await new Promise(resolve => setTimeout(resolve, 500));
	}

	async function remove(id) {
		await new Promise(resolve => setTimeout(resolve, 200));
	}

    return {
        subscribe,
		set,
		update,
        download,
        remove: (id) => remove(id),
        upload: (sched) => upload(sched)
    }
}

export const schedule_store = createScheduleStore()