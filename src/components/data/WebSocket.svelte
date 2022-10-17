<script>
	import {onMount} from 'svelte'
	import {status_store} from '../../lib/stores/status.js'
	let socket

	onMount(() => {
		connect2socket(socket)
	})

	function connect2socket(s) {
		var host = window.location.host
		// Vite Proxy crash with openevse web socket so connecting directly in dev mode
		if (import.meta.env.DEV) { 
			host = import.meta.env.VITE_OPENEVSEHOST
		}
		if (host.includes("github.io")) {
			s = null
			// download states from http ( trick for demo in github page )
			status_store.download()
		}

		else {
			s = new WebSocket("ws://" + host + "/ws")
			s.addEventListener("message", function (event) {
				const jsondata = JSON.parse(event.data.toString())
				let store = Object.assign({}, $status_store);
				store = {...store, ...jsondata}
				status_store.update(() => store)
			})
			s.addEventListener("error", function (event) {
				// TODO
			})
			s.addEventListener("close", function (event) {
				// TODO
			})
		}
	}
</script>
