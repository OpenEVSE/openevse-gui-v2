import { get, writable } from 'svelte/store'
import claim_fakedata from './claim.json'

const EvseClient_OpenEVSE_Manual = 65537 //Client ID we use for claims

function createClaimStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	// get claim from clientid EvseClient_OpenEVSE_Manual
	async function getClaim() {
		P.update(() => claim_fakedata)
		await new Promise(resolve => setTimeout(resolve, 500));
		return P
}
	// set {claim for clientid EvseClient_OpenEVSE_Manual
    async function setClaim(data) {
		let store = get(P)
		store = {...store, ...data}
        console.log("set claim: " + store)
		P.update(() => store)
		await new Promise(resolve => setTimeout(resolve, 500));
        return P
    }

	// remove clientid EvseClient_OpenEVSE_Manual claim 
    async function releaseClaim() {
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
        getClaim,
        releaseClaim,
        setClaim: (data) => setClaim(data)
    }
}

export const claim_store = createClaimStore()