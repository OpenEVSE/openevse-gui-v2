import wifisignal1 from '../assets/wifi_signal_1.svg';
import wifisignal2 from '../assets/wifi_signal_2.svg';
import wifisignal3 from '../assets/wifi_signal_3.svg';
import wifisignal4 from '../assets/wifi_signal_4.svg';
import wifisignal5 from '../assets/wifi_signal_5.svg';

export function dbm2icon(dbm) {
	let icon
	if (dbm <= -80) icon = wifisignal1
	else if (dbm > -80 && dbm <= -75) icon = wifisignal2
	else if (dbm > -75 && dbm <= -70) icon = wifisignal3
	else if (dbm > -70 && dbm <= -65) icon = wifisignal4
	else if (dbm > -65) icon = wifisignal5

	return icon
}

export async function httpAPI(method,url,body=null,type = "json") {
	let content_type = type == "json"?'application/json':'text/plain'
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

function getTZ(s) {
	if(s) 
		return s.split('|')[0]
	else
		return "UTC"
}
