import { get, writable } from 'svelte/store'
import {httpAPI} from '../utils.js'

const model = {
	state: undefined,
    max_current: undefined,
    charge_current: undefined,
    energy_limit: undefined,
    time_limit: undefined,
	auto_release: undefined
  }

function createOverrideStore() {
    const P  = writable(model)
    const { subscribe, set, update } = P

	async function download() {
		let res = await httpAPI("GET", "/override")
		P.update(() => res)
		return P
}
    async function upload(data) {
        let override = get(P)
		let newoverridestore = {...override, ...data}
        let res = await httpAPI("POST", "/override", JSON.stringify(newoverridestore))
		P.update(() => newoverridestore)
        return P
    }
    async function clear() {
        let res = await httpAPI("DELETE", "/override")
        //let store = {}

        P.update((s) => {return model})
        return P
    }

    return {
        subscribe,
		get: (s) => get(s), // little hack to access get() method inside the object itself
        set,
        update,
        download,
        clear,
        upload: (data) => upload(data)
    }
}

export const override_store = createOverrideStore()