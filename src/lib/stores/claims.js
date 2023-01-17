import {EvseClients}        from "../vars.js"
import { get, writable }    from 'svelte/store'
import {httpAPI}            from '../utils.js'

function createClaimStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download() {
        let res = await httpAPI("GET", "/claims");
        if (res && (res.msg != "error" && res != "error")) {
            P.update(() => res)
            return true
        }
        else return false
    }
    
    async function upload(data,clientid) {
        let res = await httpAPI("POST", "/claims/" + clientid , JSON.stringify(data))
        if (res.msg && res.msg == "done")
            return true
        else return false
    }

    async function release(clientid=EvseClients["manual"].id) {
        let res = await httpAPI("DELETE", "/claims/" +clientid)
        if (res) {
            let store = []
            P.update(() => store)
            return true
        }
        else return false

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
        // download latest claims
        let res = await claims_store.download()
        if (res) {
            let claims = get(P)
            for (let i in claims) {
                if (claims[i].client == clientid ) {
                    // found clientid claim
                    if (claims[i][prop]) {
                            // claim has prop
                        
                        delete claims[i][prop]
                        if (Object.keys(claims[i]).length  <= 3 && claims[i].auto_release != undefined) {
                            // there's only one key check if it's auto_release 
                            delete claims[i]
                        }
                        if (claims[i]) {
                            res = await claims_store.upload(claims[i],clientid)
                            return res
                        } else {
                            res = await claims_store.release(clientid)
                            return res
                        }
                    }    
                    else console.log("error: No such prop in claim, can't remove")         
                }
                else console.log("error: No claims from client id, can't remove")
            }     
        }
        
        else return false
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