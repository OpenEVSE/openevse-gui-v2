import { writable } from 'svelte/store'

export function createScheduleStore() {
    const { subscribe, set, update } = writable({
        loaded: false,
        schedule: []})

	async function fetchSchedule() {
		const response = await fetch('/schedule')
            if(response.ok) {
                const json_response = await response.json()
				for ( let t = 0; t < json_response.length ; t++) {
					json_response[t].time = json_response[t].time.slice(0,5) // remove useless seconds
				}			
                console.log(json_response)
                set(json_response)
                return json_response
            }
            throw Error(response.statusText)
	}

    return {
        subscribe,
		set: (data) => set(data),
        fetch: fetchSchedule,

        delete: async (id) => {
            const response = await fetch('/schedule/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if(response.ok) {
				const json_response = await response.json()
				console.log(json_response)
                return response
            }
            else {
                // refetch timers
                fetchSchedule()
            }
            throw Error(response.statusText)
        },

        update: async (schedule) => {
			
            const response = await fetch('/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(schedule)
            })

            if(response.ok) {
                const json_response = await response.json()
				console.log(json_response)
                update(json_response => json_response)
                return json_response
            }

            throw Error(response.statusText)

        }

    }
}

export const schedule_store = createScheduleStore()