import { get, writable } from 'svelte/store'
import {httpAPI} from '../utils.js'


function createOverrideStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function getOverride() {
		let res = await httpAPI("GET", "/override")
		P.update(() => res)
		return P
}
    async function setOverride(data) {
        let override = get(P)
		let newoverridestore = {...override, ...data}
        let res = await httpAPI("POST", "/override", JSON.stringify(newoverridestore))
		P.update(() => newoverridestore)
        return P
    }
    async function clearOverride() {
        let res = await httpAPI("DELETE", "/override")
        let store = {}
        P.update(() => store)
        return P
    }

    return {
        subscribe,
		get: (s) => get(s), // little hack to access get() method inside the object itself
        set,
        update,
        getOverride,
        clearOverride,
        setOverride: (data) => setOverride(data)
    }
}

export const override_store = createOverrideStore()