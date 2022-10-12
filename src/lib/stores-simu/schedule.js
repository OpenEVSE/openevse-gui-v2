import { writable } from 'svelte/store'

let default_schedule = [
	{
	  id: 1,
	  state: "active",
	  time: "20:35",
	  days: [
		"monday",
		"tuesday",
		"wednesday",
		"saturday"
	  ]
	},
	{
		id: 2,
		state: "disabled",
		time: "09:25",
		days: [
		  "monday",
		  "tuesday",
		  "wednesday",
		  "sunday"
		]
	  }
  ]

export function createScheduleStore() {
	const P  = writable(default_schedule)
    const { subscribe, set, update } = P
	
	async function download() {
		await new Promise(resolve => setTimeout(resolve, 2000));
	}

	async function upload(sched) {
		await new Promise(resolve => setTimeout(resolve, 2000));
	}

	async function remove(id) {
		await new Promise(resolve => setTimeout(resolve, 2000));
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