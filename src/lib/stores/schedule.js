import { writable } from 'svelte/store'

function createScheduleStore() {
    const P  = writable([])
    const { subscribe, set, update } = P

	async function download() {
		const response = await fetch('/schedule')
            if(response.ok) {
                const json_response = await response.json()
				for ( let t = 0; t < json_response.length ; t++) {
					json_response[t].time = json_response[t].time.slice(0,5) // remove useless seconds
				}			
                P.update(() => json_response)
                return P
            }
            throw Error(response.statusText)
	}
    async function upload(data) {
        const response = await fetch('/schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if(response.ok) {
            const json_response = await response.json()
            update(P => P)
            return P
        }
        throw Error(response.statusText)
    }
    async function remove(id) {
        const response = await fetch('/schedule/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if(response.ok) {
            await response.json()
            return P
        }
        else {
            // refetch timers
            download()
        }
        throw Error(response.statusText)
    }

    return {
        subscribe,
        set,
        update,
        download,
        delete: (id) => remove(id),
        upload: (schedule) => upload(schedule)
    }
}

export const schedule_store = createScheduleStore()