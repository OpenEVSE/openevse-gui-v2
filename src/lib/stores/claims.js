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
        
        let claims = get(P)
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

    function removeClaimProp(clientid,prop) {
        console.log(" clientid: " + clientid + " prop: " + prop)
        let res = serialQueue.add(claims_store.download)
        if (res) {
            let claims = get(P)
            for (let i in claims) {
                if (claims[i].client == clientid ) {
                    if (claims[i][prop])
                        delete claims[i][prop]
                    serialQueue.add(claims_store.upload(claims[i],clientid) )             
                }
            }     
        }
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