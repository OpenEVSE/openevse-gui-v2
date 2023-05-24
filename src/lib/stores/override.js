import { get, writable } from 'svelte/store'
import {httpAPI} from '../utils.js'
import {status_store} from './status.js'


// const model = {
// 	// state: undefined,
//     // max_current: undefined,
//     // charge_current: undefined,
//     // auto_release: undefined,
//     // msg: undefined
//   }

function createOverrideStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download() {
        let res = await httpAPI("GET", "/override")
        if (res?.msg == undefined) {
            P.update(() => res)
            return true
        }
        else if (res?.msg === 'No manual override') {
            let store = {}
            P.update(() => store)
            return true
        }
        else {
            return false
        }
    }
    async function upload(data) {
        // let override = get(P)
		// let newoverridestore = {...override, ...data}
        let res = await httpAPI("POST", "/override", JSON.stringify(data))
        P.update(() => data)
        return P
    }
    async function clear() {
        if (get(override_store)) {
            let res = await httpAPI("DELETE", "/override")
            if (res) {
                let store = {}
                P.update(() => store)
                return true
            } else return false
        }
        else return false
    }

    async function toggle() {
        let res = await httpAPI("PATCH", "/override")
        if (res.msg === "Updated") {
            return true
        }
        else return false
    }

    async function removeProp(prop) {
        let override = get(P)
        let res
        if (override[prop]) {
            // override has prop
            delete override[prop]      
            if (Object.keys(override).length  == 1 && override.auto_release != undefined) {
                // there's only one key check if it's auto_release           
                res = await override_store.clear()
                return res            
            } else { 
                res = await override_store.upload(override)
                return res
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
        clear,
        upload: (data) => upload(data),
        toggle,
        removeProp: (prop) => removeProp(prop)
    }
}

export const override_store = createOverrideStore()