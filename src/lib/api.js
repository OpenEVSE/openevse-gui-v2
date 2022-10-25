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
	const response = await fetch(url, data)
	if(response) {
		if(type == "json") {
			const json_response = response.json()
			return json_response
		}
		else return response
		
	}
	throw Error(response.statusText)
}


