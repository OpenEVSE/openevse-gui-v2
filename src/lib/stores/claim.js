import { get, writable } from 'svelte/store'
import {httpAPI} from '../api.js'
const EvseClient_OpenEVSE_Manual = 65537 //Client ID we use for claims

function createClaimStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	// get claim from clientid EvseClient_OpenEVSE_Manual
	async function getClaim() {
		let res = await httpAPI("GET", "/claims/" + EvseClient_OpenEVSE_Manual)
		P.update(() => res)
		return P
}
	// set {claim for clientid EvseClient_OpenEVSE_Manual
    async function setClaim(data) {
        let claim = get(P)
		let newclaim = {...claim, ...data}
        let res = await httpAPI("POST", "/claims/" + EvseClient_OpenEVSE_Manual, JSON.stringify(data))
		newclaim = {...claim, ...data}
		P.update(() => newclaim)
        return P
    }

	// remove clientid EvseClient_OpenEVSE_Manual claim 
    async function releaseClaim() {
        let res = await httpAPI("DELETE", "/claims/" + EvseClient_OpenEVSE_Manual)
        let store = {}
        P.update(() => store)
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