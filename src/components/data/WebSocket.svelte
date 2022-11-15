<script>
	import { DateTime } from "luxon";
	import { status_store } from './../../lib/stores/status.js'
	import { onMount, onDestroy } from 'svelte'
	

	let socket
	let timerId
	let lastmsg
	let timeout
	// let isgettingclaim = false
	// let isgettingschedule = false
	// let isgettingplan = false

	onMount(() => {
		connect2socket(socket)
	})

	onDestroy(()=> {
		if (socket)
			socket.close()
		if (timeout)
			clearTimeout(timeout)
	})

	function connect2socket(s) {
		var host
		if (import.meta.env.VITE_REMOTEHOST == "true")
			host = import.meta.env.VITE_OPENEVSEHOST
		else host = window.location.host
		
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
			s.addEventListener("open", function (event) {
				console.log("connected to websocket")
				keepAlive(s)
			} )
			s.addEventListener("message", function (event) {
				lastmsg = DateTime.now().toUnixInteger()
				const jsondata = JSON.parse(event.data.toString())
				let store = Object.assign({}, $status_store);
				store = {...store, ...jsondata}
				status_store.update(() => store)
			})
			s.addEventListener("error", function (event) {
				console.log("socket error")
				lastmsg = DateTime.now().toUnixInteger()
				cancelKeepAlive()
				if (!timeout)
					timeout = setTimeout(() => {
						connect2socket(s)
					}, 2000);
				
			})
			s.addEventListener("close", function (event) {
				console.log("socket closed, reconnecting in 2s")
				lastmsg = DateTime.now().toUnixInteger()
				cancelKeepAlive()
				if (!timeout)
					timeout = setTimeout(() => {
						connect2socket(s)
					}, 2000);
			})
		}
	}

	function keepAlive(s) { 
		let newmsg = DateTime.now().toUnixInteger()
		let timing = newmsg - lastmsg
		if (timing >= 60) {
			// Roger we have a problem, try to reconnect the websocket
			console.log("No msg over websocket for " + timing + " sec, restart websocket")
			s.close()
			cancelKeepAlive()  
			if (!timeout)
				timeout = setTimeout(() => {
					lastmsg = DateTime.now().toUnixInteger()
					connect2socket(s)
				}, 200);
			return
		}
		
		if (s && s.readyState == s.OPEN) {  
			s.send("{\"ping\":1}");  
		}  
		timerId = setTimeout(()=>keepAlive(s), 5000);  
		return
	}
	
	function cancelKeepAlive() {  
		if (timerId) {  
			clearTimeout(timerId);  
		}
    }  
</script>
