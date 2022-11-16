import {EvseClients} from "../vars.js"
import { get, writable } from 'svelte/store'
import {httpAPI} from '../utils.js'

function createClaimStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	// get claim from clientid EvseClient_OpenEVSE_Manual
	async function download() {
        let claims = await httpAPI("GET", "/claims");
        if (claims && claims.msg != "error") {
            for (let i in claims) {
                if (claims[i].client == EvseClients["manual"] ) {
                    P.update(() => claims[i])
                    
                }
            }
            return true
        }
        else if (claims.length) {
            let claim = {}
            P.update(() => claim)
            return true
        }
        else return false
    }
	// set {claim for clientid EvseClient_OpenEVSE_Manual
    async function upload(data) {
        let claim = get(P)
		let newclaim = {...claim, ...data}
        let res = await httpAPI("POST", "/claims/" + EvseClients["manual"], JSON.stringify(data))
		newclaim = {...claim, ...data}
		P.update(() => newclaim)
        return P
    }

	// remove clientid EvseClient_OpenEVSE_Manual claim 
    async function release() {
        let res = await httpAPI("DELETE", "/claims/" + EvseClients["manual"])
        let store = {}
        P.update(() => store)
        return P
    }

    return {
        subscribe,
		get: (s) => get(s), // little hack to access get() method inside the object itself
        set,
        update,
        download,
        upload: (data) => upload(data),
        release

    }
}

export const claim_store = createClaimStore()