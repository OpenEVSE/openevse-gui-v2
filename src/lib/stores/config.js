import { writable } from 'svelte/store'
import {httpAPI} from '../utils.js'

function createConfigStore() {
    const P  = writable()
    const { subscribe, set, update } = P

	async function download() {
        let res = await httpAPI("GET", "/config")
        if (res && (res.msg != "error" && res != "error")) {
            P.update(() => res)
            return true
        }
        else return false
	}
   
    async function upload(data) {
        let res = await httpAPI("POST", "/config", JSON.stringify(data))
        if (res.msg == "done" || res.msg == "no change")
            return true
        else return false
    }

    async function saveParam(name,val) {
		let data = {}
			data[name] = val
			if (await config_store.upload(data)) 
				{
					return true
				}
			else {
				return false
			}
	}

    return {
        subscribe,
        set,
        update,
        download,
        upload: (data) => upload(data),
        saveParam: (attr,val) => saveParam(attr,val)
    }
}

export const config_store = createConfigStore()
