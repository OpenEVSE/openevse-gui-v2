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
	  return error
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

export function utc2evseLocalTime(d,tz,y = false) {
	let model = { 
		timeZone: getTZ(tz),
		year: y?'numeric':'2-digit',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		}
	let lt = d.toLocaleString(navigator.language, model)
	return lt
}

export function formatDate(t,z,y = false) {
	const utctime = new Date(t)
	return utc2evseLocalTime(utctime, z, y)
}

export function displayTime(t,tz) {
	const _d = new Date('1970-01-01T' + t )
	const  _dl = utc2evseLocalTime(_d, tz).split(" ")
	var is12 = false
	var ampm = ""
	if (_dl[2]) {
		is12=true
	}
	if (is12) {
		ampm = " " + _dl[2]
	}
	var formattedTime = _dl[1] + ampm
	return formattedTime
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