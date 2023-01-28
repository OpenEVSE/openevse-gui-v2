import {_} 					from 'svelte-i18n'
import {DateTime} 			from "luxon";
import {EvseClients}		from "./vars.js"
import { uistates_store } 	from "./stores/uistates.js";
import {get} 				from 'svelte/store'
import { config_store } 	from './stores/config.js';
import serialQueue 			from './queue.js';

export async function httpAPI(method,url,body=null,type = "json",timeout = 10000) {
	let content_type = type == "json"?'application/json':'application/x-www-form-urlencoded; charset=UTF-8'
	const controller = new AbortController();
	let data = {
		method: method,
		signal: controller.signal,
		headers: {
			'Content-Type': content_type
		}
	}
	if (body) {
		data.body = body
	}
	// do not timeout on first request in case there's authentication
	if (get(uistates_store).has_fetched)
		setTimeout(() => controller.abort(), timeout);
	if (import.meta.env.DEV) {
		if (!url.includes("http",0))
			url = "/api" + url
	}
	const res = await fetch(url, data).then((response) => {
		if (!response.ok) {
		//   throw new Error("Bad response from server: " + response.status);
		  return "error"
		}
		else {
			if(type == "json") {
				// @ts-ignore
				const json_response = response.json()
				return json_response
			}
			// @ts-ignore
			else return response.text()
		}
	}).catch((error) => {
		console.log(error)
		return "error"
	});

	uistates_store.update(x => {
		x.has_fetched = true;
		return x;
   });

	return res
		
}


export const removeDuplicateObjects = (array, key) => {
    const set = new Set()

    return array.filter(item => {
        const alreadyHas = set.has(item[key])
        set.add(item[key])

        return !alreadyHas
    })
}

export function sec2time(sec) {
	return new Date(sec * 1000).toISOString().slice(11, 16)
}

export function formatDate(t,z,format=null) {
	let d
	if (z) {
		let tz = z.split("|")[0]
		d = DateTime.fromISO(t).setZone(tz)
	}
	else d = DateTime.fromISO(t)
	const arr = d.toLocaleString(DateTime.DATETIME_SHORT).split(" ")
	let datearr = arr[0].split("/")
	if (format=="short") {
		//remove year
		datearr.pop()
	}
	// fixing missing trailing 0 luxxon bug on US locale
	datearr[0] = datearr[0]?.length == 1?"0"+datearr[0]:datearr[0]
	datearr[1] = datearr[1]?.length == 1?"0"+datearr[1]:datearr[1]
	const date = datearr.join("/")
	let time = arr[1]
	if (arr[2]) 
		time += " " + arr[2]

	return date + " " + time
}

export function displayTime(t) {
	const d = DateTime.fromISO(t).toLocaleString(DateTime.TIME_SIMPLE) 
	return d
}

export function getTZ(s) {
	if(s) 
		return s.split('|')[0]
	else
		return "UTC"
}

export function createTzObj(tz) {
	if (tz) {
		var tzobj = []
		// @ts-ignore
		Object.entries(tz).forEach((element,index,array) => {
			tzobj[index] = {name: element[0], value: element[0] + "|" + element[1]}
		})
		return tzobj
	}
}

export function round(value, precision = null) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}

export let getBreakpoint = function () {
	const mobilemini = 410 
    const mobile = 640
    const tablet = 1280
    //const desktop = 1440
    var bp
    if (window.innerWidth <= mobilemini) bp = "mobilemini"
	else if (window.innerWidth > mobilemini && window.innerWidth <= mobile) bp = "mobile"
    else if (window.innerWidth > mobile && window.innerWidth <= tablet) bp = "tablet"
    else if (window.innerWidth > tablet) bp="desktop"
    else bp="unknown"
   
    return bp;
};

export function clientid2name(id) {
	let name
	switch (id) {
		case EvseClients["manual"].id:
			name =  "manual"
			break;
		case EvseClients["divert"].id:
			name = "divert"
			break;
		case EvseClients["timer"].id:
			name = "timer"
			break;
		case EvseClients["ohm"].id:
			name = "ohm"
			break;
		case EvseClients["ocpp"].id:
			name = "ocpp"
			break;
		case EvseClients["rfid"].id:
			name = "rfid"
			break;
		case EvseClients["mqtt"].id:
			name = "mqtt"
			break;
		case EvseClients["shaper"].id:
			name = "shaper"
			break;
	}
	return name

}

export function displayIcon(mode) {
	switch (mode) {
		case "manual":
			return "fa6-solid:hand"
		default:
			return "fa6-solid:robot"
	}
}
export function getStateDesc(state) {
	switch (state) {
		case 0: return get(_)("logs-states.loading")
		case 1: return get(_)("logs-states.active-nocar")
		case 2: return get(_)("logs-states.active-car")
		case 3: return get(_)("logs-states.active-charge")
		// Errors
		case 4: return get(_)("logs-states.error-vent")
		case 5: return get(_)("logs-states.error-diode")
		case 6:return get(_)("logs-states.error-gfi")
		case 7: return  get(_)("logs-states.error-ground")
		case 8: return get(_)("logs-states.error-relay")
		case 9: return get(_)("logs-states.error-gfitest")
		case 10: return get(_)("logs-states.error-temp")
		case 11: return get(_)("logs-states.error-current")
		case 254: return get(_)("logs-states.sleeping")
		case 255: return get(_)("logs-states.disabled")
	}
}

export function state2icon(state) {
	let icon = { 
		type: undefined,
		color: undefined,
		tooltip: undefined
	}

	icon.tooltip = getStateDesc(state)
	switch (state) {
		case 0:
			icon.type = "majesticons:rocket-3-start-line"
			icon.color = "has-text-info"
			break
		case 1: 
			icon.type = "mdi:car-off"
			icon.color = "has-text-danger"
			break
		case 2:
			icon.type = "mdi:car"
			icon.color = "has-text-primary"
			break
		case 3:
			icon.type = "fa6-solid:bolt"
			icon.color = "has-text-warning"
			break
		// Errors
		case 4: 
			icon.type = "fa6-solid:bolt"
			icon.color = "has-text-warning"
			break

		case 5:
			icon.type = "fa6-solid:bolt"
			icon.color = "has-text-warning"
			break

		case 6:
			icon.type = "fa6-solid:bolt"
			icon.color = "has-text-warning"
			break
		case 7:
			icon.type = "fa6-solid:bolt"
			icon.color = "has-text-warning"
			break
		case 8:
			icon.type = "fa6-solid:bolt"
			icon.color = "has-text-warning"
			break
		case 9:
			icon.type = "fa6-solid:bolt"
			icon.color = "has-text-warning"
			break
		case 10:
			icon.type = "fa6-solid:bolt"
			icon.color = "has-text-warning"
			break
		case 11:
			icon.type = "fa6-solid:triangle-exclamation"
			icon.color = "has-text-danger"
			break;
		case 254: // sleeping
			icon.color = "has-text-danger"
			icon.type = "fa6-solid:ban"
			break;
		case 255: 
			icon.color = "has-text-danger"
			icon.type = "fa6-solid:circle-xmark"
			break;
	}
	return icon
}

export function type2icon(type) {
	let icon
	switch (type) {
		case "information":
			icon = "fa6-solid:circle-info"
			break
		case "notification":
			icon = "fa6-solid:bell"
			break
		case "warning":
			icon = "fa6-solid:triangle-exclamation"
			break
	}
	return icon
}

export function dedup(arr) {
	var hashTable = {};

	return arr.filter(function (el) {
		var key = JSON.stringify(el);
		var match = Boolean(hashTable[key]);

		return (match ? false : hashTable[key] = true);
	});
}

export function s2mns(s){return(s-(s%=60))/60+(9<s?'mn ':'mn 0')+s+'s'}

export function miles2km(d) {
	return d * 1.60934
}
export function validateFormData({data, i18n_path, req=false, form=null}) {
	let resp = { 
		ok: true,
		msg: null,
		data: {}
	}
	for (const key of Object.keys(data)) {
		if (data[key].req && !data[key].val && req) {
				//error
				resp.ok = false
				resp.msg = get(_)(i18n_path + key)
				let val = get(config_store)[key]?get(config_store)[key]:""
				// refill the input field
				if (form) {
					form[key].input.setValue(val)
				}					
				else {
					data[key].input.setValue(val)
				}
		}
		else {
			const hiddenpass = "••••••••••"
			resp.data[key] = data[key].val
			if (data[key].pwd && data[key].val != hiddenpass)
			{
				resp.data[key] = data[key].val
			}
			else {
				if (data[key].pwd) {
					delete resp.data[key]
				}
					
			} 

		}
	}
	return resp
}

export async function postFormData(data,ref=null) {
	if ( await serialQueue.add(() => config_store.upload(data))) {
		return true
	}
	else {
		return false
	}
}


export let submitFormData = async ({form, prop = null,prop_enable = null, i18n_path = null, input = null}) => {
	let propdata = {}
	let enabled
	if (prop_enable)
		enabled = get(config_store)[prop_enable]
	else enabled = false
	if (prop) {
		propdata[prop] = {
			val: 	form[prop].val,
			req: 	form[prop].req,
			input: 	form[prop].input
		}
	}
	// get input instance
	if (!input) {
		let o = {}
		let p
		if (!prop) {
			o = form
			p = prop_enable
		}		
		else {
			o = propdata
			p = prop
		}
		input = o[p].input
	}

	let valid = validateFormData(
		{
			data: prop?propdata:form,
			i18n_path: i18n_path,
			req: prop?enabled:!enabled ,
			form: prop?form:null
		}
	)
	if (valid.ok) {

		input?.setStatus("loading")

		if (await serialQueue.add(() => config_store.upload(valid.data))) {
			input?.setStatus("ok")
			return true
		}				
		else {
			input?.setStatus("error")
			return true
		}
	}
	else {
		if (!prop && prop_enable)
			{
				const val = get(config_store)[prop_enable]
				input.setValue(val)
			}
			
		get(uistates_store).alertbox.title = "error"
		get(uistates_store).alertbox.body = valid.msg
		get(uistates_store).alertbox.visible = true
		return false
	}

}
