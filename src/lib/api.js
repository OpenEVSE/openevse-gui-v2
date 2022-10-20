export async function httpAPI(method,url,body=null) {
	let data = {
		method: method,
		headers: {
			'Content-Type': 'application/json'
		},
	}
	if (body) {
		data.body = body
	}
	const response = await fetch(url, data)
	if(response) {
		const json_response = response.json()
		return json_response
	}
	throw Error(response.statusText)
}

