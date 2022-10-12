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
		await new Promise(() => setTimeout( () => {
			P.update(P => P)
			return P
		}, 2000))
		return P
	}

    return {
        subscribe,
		set,
		update,
        download,
        delete: (id) => "OK",
        upload: (schedule) => update(schedule)
    }
}

export const schedule_store = createScheduleStore()