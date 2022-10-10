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
    const { subscribe, set, update } = writable([])
	
	async function fetchSchedule() {
		const response = default_schedule	
                set(response)
                return response
	}

    return {
        subscribe,
		set: (data) => set(data),
        fetch: fetchSchedule,

        delete: () => "OK",

        update: (schedule) => { 	
                update(schedule => schedule)
                return schedule
            }

    }
}

export const schedule_store = createScheduleStore()