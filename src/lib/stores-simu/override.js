import { get, writable } from 'svelte/store'
import claim_fakedata from './override.json'

function createOverrideStore() {
    const P  = writable()
    const { subscribe, set, update } = P


	async function getOverride() {
		P.update(() => claim_fakedata)
		await new Promise(resolve => setTimeout(resolve, 500));
		return P
}
    async function setOverride(data) {
		let override = get(P)
        let newoverride = {...override, ...data}
		P.update(() => newoverride)
		await new Promise(resolve => setTimeout(resolve, 500));
        return P
    }

    async function clearOverride() {
		let store = {}
        P.update(() => store)
        await new Promise(resolve => setTimeout(resolve, 500));
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