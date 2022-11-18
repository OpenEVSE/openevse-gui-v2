import {EvseClients} from "../vars.js"
import { get, writable } from 'svelte/store'
import {httpAPI} from '../utils.js'
import { serialQueue }			from "./../queue.js";

function createClaimStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download() {
        let claims = await httpAPI("GET", "/claims");
        if (claims) {
            P.update(() => claims)
            return true
        }
        else return false
    }
    
	// set {claim for clientid EvseClient_OpenEVSE_Manual
    async function upload(data,clientid) {
        let res = await httpAPI("POST", "/claims/" + clientid , JSON.stringify(data))
        if (res.msg && res.msg == "done")
            return true
        else return false
    }

	// remove clientid EvseClient_OpenEVSE_Manual claim 
    async function release() {
        let res = await httpAPI("DELETE", "/claims/" + EvseClients["manual"])
        let store = {}
        P.update(() => store)
        return P
    }

    function getClaim(clientid) {
        let claims = get(P)
        for (let i in claims) {
            if (claims[i].client == clientid ) {
                return claims[i]              
            }
            else return false
        }
    }

    async function removeClaimProp(clientid,prop) {
        // get lat"est claims
        let res = await serialQueue.add(claims_store.download)
        if (res) {
            let claims = get(P)
            for (let i in claims) {
                if (claims[i].client == clientid ) {
                    // found clientid claim
                    if (claims[i][prop]) {
                         // claim has prop
                        delete claims[i][prop]
                        await serialQueue.add(() => claims_store.upload(claims[i],clientid))
                        return res
                    }             
                }
            }     
        }
        return false
    }

    return {
        subscribe,
		get: (s) => get(s), // little hack to access get() method inside the object itself
        set,
        update,
        download,
        upload: (data,clientid) => upload(data,clientid),
        release,
        getClaim: (clientid) => getClaim(clientid),
        removeClaimProp: (clientid, prop) => removeClaimProp(clientid, prop)
    }
}

export const claims_store = createClaimStore()