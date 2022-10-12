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

	async function upload(data) {
		await new Promise(resolve => setTimeout(resolve, 2000));
	}

	async function delete(id) {
		await new Promise(resolve => setTimeout(resolve, 2000));
	}

    return {
        subscribe,
		set,
		update,
        download,
        delete: (id) => "OK",
        upload: (data) => update(data)
    }
}

export const schedule_store = createScheduleStore()