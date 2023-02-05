import { writable }         from 'svelte/store'
import {httpAPI}            from '../utils.js'

let model = { 
    type: "none",
    value: 0, 
    auto_release: true
}

function createLimitStore() {
    const P  = writable(model)
    const { subscribe, set, update } = P

	async function download() {
            let res = await httpAPI("GET", "/limit")
            if (res && res.hasOwnProperty("type")) {
                P.update(() => res)
                return true
            }
            else if (res && res.hasOwnProperty("msg") && res.msg == "no limit") {
                // reset limit to default
                P.update(()=>model)
                return true
            }
            else return false
	}

    async function upload(data) {
        let res = await httpAPI("POST", "/limit",JSON.stringify(data))
        if (res.msg == "done")
            return true
        else return false
    }

    async function remove(id) {
        let res = await httpAPI("DELETE", "/limit")
        if (res.msg == "done") {
            P.update(()=>model)
            return true
        }
        else return false
    }

    function reset() {
        P.update(()=>model)
        return true
    }

    return {
        subscribe,
        set,
        update,
        download,
        reset,
        remove: (id) => remove(id),
        upload: (data) => upload(data)
    }
}

export const limit_store = createLimitStore()