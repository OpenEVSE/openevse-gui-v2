import { DateTime } from "luxon";
import {EvseClients} from "./vars.js"
import {faHand, faRobot} from '@fortawesome/free-solid-svg-icons/index.js'

export async function httpAPI(method,url,body=null,type = "json") {
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
	
	setTimeout(() => controller.abort(), 10000);
	const res = await fetch(url, data).then((response) => {
		if (response.status >= 400 && response.status < 600) {
		//   throw new Error("Bad response from server: " + response.status);
		  return "error"
		}
		return response
	}).then((response) => {
	   if(type == "json") {
		const json_response = response.json()
		return json_response
		}
		else return response.text()
	}).catch((error) => {
		console.log(error)
		return "error"
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

export function formatDate(t,z) {
	let tz = z.split("|")[0]
	const d = DateTime.fromISO(t).setZone(tz)
	return d.toLocaleString(DateTime.DATETIME_MED	)
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
		Object.entries(tz).forEach((element,index,array) => {
			tzobj[index] = {name: element[0], value: element[0] + "|" + element[1]}
		})
		return tzobj
	}
}

export function round(value, precision) {
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
		case EvseClients["manual"]:
			 name =  "manual"
			 break;
		case EvseClients["divert"]:
			 name = "divert"
			 break;
		case EvseClients["timer"]:
			  name = "timer"
			  break;
		case EvseClients["ohm"]:
				 name = "ohm"
				 break;
		case EvseClients["ocpp"]:
				name = "ocpp"
				break;
		case EvseClients["rfid"]:
			   name = "rfid"
			   break;
		case EvseClients["mqtt"]:
				 name = "mqtt"
				 break;
	}
	return name

}

export function displayIcon(mode) {
	switch (mode) {
		case "manual":
			return faHand
		default:
			return faRobot
	}
}