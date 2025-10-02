import { writable } from 'svelte/store'
import {httpAPI} from '../utils.js'

function createConfigStore() {
    const P  = writable()
    const { subscribe, set, update } = P

    // Helper to determine if firmware is a European variant
    function isEuropeanFirmware(fw) {
        return typeof fw === 'string' && (fw.endsWith('.EU') || fw.endsWith('.T2'))
    }

    // Ensure any object placed in the store has the derived flag
    function withDerived(obj) {
        if (obj && typeof obj === 'object') {
            const firmware_is_eu = isEuropeanFirmware(obj.firmware)
            // EU firmware capped at 32A, otherwise 80A
            const max_current_firmware = firmware_is_eu ? 32 : 80
            return { ...obj, firmware_is_eu, max_current_firmware }
        }
        return obj
    }

	async function download() {
        let res = await httpAPI("GET", "/config")
        if (res && (res.msg != "error" && res != "error")) {
            P.update(() => withDerived(res))
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
		if (await config_store.upload(data)) {
            // After a successful param save we should refresh (lightweight: update current object)
            update(current => withDerived({ ...current, [name]: val }))
			return true
		} else {
			return false
		}
	}

    // Wrapped set/update so external callers always get derived property maintained
    function setWithDerived(value) { set(withDerived(value)) }
    function updateWithDerived(fn) { update(curr => withDerived(fn(curr))) }

    return {
        subscribe,
        set: setWithDerived,
        update: updateWithDerived,
        download,
        upload: (data) => upload(data),
        saveParam: (attr,val) => saveParam(attr,val)
    }
}

export const config_store = createConfigStore()
