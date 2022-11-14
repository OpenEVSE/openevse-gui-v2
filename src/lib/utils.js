import { DateTime } from "luxon";

export async function httpAPI(method,url,body=null,type = "json") {
	let content_type = type == "json"?'application/json':'application/x-www-form-urlencoded; charset=UTF-8'
	let data = {
		method: method,
		headers: {
			'Content-Type': content_type
		}
	}
	if (body) {
		data.body = body
	}
	//const response = await fetch(url, data)
	const res = await fetch(url, data).then((response) => {
		if (response.status >= 400 && response.status < 600) {
		  throw new Error("Bad response from server: " + response.status);
		}
		return response;
	}).then((response) => {
	   if(type == "json") {
		const json_response = response.json()
		return json_response
		}
		else return response.text()
	}).catch((error) => {
		console.log(error)
		if(type == "json")
		return {msg: "error"}
		else return "error"
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

export function formatDate(t,z) {
	const d = DateTime.fromISO(t)
	d.setZone(z)
	return d.toLocaleString(DateTime.DATETIME_SHORT)
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
    const mobile = 768;
    const tablet = 1280;
    //const desktop = 1440;
    var bp
    if (window.innerWidth <= mobile) bp = "mobile"
    else if (window.innerWidth > mobile && window.innerWidth <= tablet) bp = "tablet"
    else if (window.innerWidth > tablet) bp="desktop"
    else bp="unknown"
   
    return bp;
};