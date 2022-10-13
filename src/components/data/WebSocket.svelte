<script>
	import {onMount} from 'svelte'
	import {status_store} from '../../lib/stores/status.js'
	let socket

	onMount(() => {
	var host = window.location.host
	// Vite Proxy crash with openevse web socket so connecting directly in dev mode
	if (import.meta.env.DEV) host = "openevse.local"  

	if (host == "kipk.github.io") {
		socket = "nosocket"
	}

	else socket = new WebSocket("ws://" + host + "/ws")

	socket.addEventListener("message", function (event) {
		const jsondata = JSON.parse(event.data.toString())
		let store = Object.assign({}, $status_store);
		store = {...store, ...jsondata}
		status_store.update(() => store)
	});
})
</script>
