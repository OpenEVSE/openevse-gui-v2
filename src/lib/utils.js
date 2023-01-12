import {_} 					from 'svelte-i18n'
import {DateTime} 			from "luxon";
import {EvseClients}		from "./vars.js"
import { uistates_store } 	from "./stores/uistates.js";
import {get} 				from 'svelte/store'

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

export function formatDate(t,z,format="") {
	let tz = z.split("|")[0]
	const d = DateTime.fromISO(t).setZone(tz)
	const arr = d.toLocaleString(DateTime.DATETIME_SHORT).split(" ")
	if (format=="short")
		arr[0] = arr[0].slice(0,5)
	return arr[0] + " " + arr[1]
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

export function state2icon(state) {
	let icon = { 
		type: undefined,
		color: undefined,
		tooltip: undefined
	}
	
	switch (state) {
		case 0:
			icon.type = "majesticons:rocket-3-start-line"
			icon.color = "has-text-info"
			icon.tooltip = get(_)("logs-states.loading")
			break
		case 1: 
			icon.type = "mdi:car-off"
			icon.color = "has-text-danger"
			icon.tooltip = get(_)("logs-states.active-nocar")
			break
		case 2:
			icon.type = "mdi:car"
			icon.color = "has-text-primary"
			icon.tooltip = get(_)("logs-states.active-car")
			break
		case 3:
			icon.type = "fa6-solid:bolt"
			icon.color = "has-text-warning"
			icon.tooltip = get(_)("logs-states.active-charge")
			break
		case 4: // Error
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
			icon.type = "fa6-solid:triangle-exclamation"
			icon.color = "has-text-danger"
			icon.tooltip = get(_)("logs-states.error")
			break;
		case 254: // sleeping
			icon.color = "has-text-danger"
			icon.type = "fa6-solid:ban"
			icon.tooltip = get(_)("logs-states.sleeping")
			break;
		case 255: 
			icon.color = "has-text-danger"
			icon.type = "fa6-solid:circle-xmark"
			icon.tooltip = get(_)("logs-states.disabled")
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