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
		console.log("Starting websocket instance")
		var host
		if (import.meta.env.VITE_REMOTEHOST == "true")
			host = import.meta.env.VITE_OPENEVSEHOST
		else host = window.location.host
		
		// Vite Proxy crash with openevse web socket so connecting directly in dev mode
		if (import.meta.env.DEV) { 
			host = import.meta.env.VITE_OPENEVSEHOST
		}
		// if (host.includes("github.io")) {
		// 	s = null
		// 	// download states from http ( trick for demo in github page )
		// 	status_store.download()
		// }

		else if (!s) {
			s = new WebSocket("ws://" + host + "/ws")
			s.addEventListener("open", function (event) {
				console.log("connected to websocket")
				keepAlive(s)
			} )
			s.addEventListener("message", function (e) {
				lastmsg = DateTime.now().toUnixInteger()
				const jsondata = JSON.parse(e.data.toString())
				let store = Object.assign({}, $status_store);
				store = {...store, ...jsondata}
				status_store.update(() => store)
			})
			s.addEventListener("error", function (e) {
				console.error('Socket encountered error: ', e.message, 'Closing socket');
				lastmsg = DateTime.now().toUnixInteger()
				cancelKeepAlive()
				if (s) s.close()	
				else setTimeout(()=>s.connect(), 1000)			
				// TODO: Display Alertbox mesg
				
				
			})
			s.addEventListener("close", function (e) {
				console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
				lastmsg = DateTime.now().toUnixInteger()
				cancelKeepAlive()
				setTimeout(()=>connect2socket(), 1000)
				
			})
		}
	}

	function keepAlive(s) { 
		let newmsg = DateTime.now().toUnixInteger()
		let timing = newmsg - lastmsg
		if (timing >= 40) {
			// Roger we have a problem, try to reconnect the websocket
			console.log("No msg over websocket for " + timing + " sec, restart websocket")
			s.close()
			lastmsg = DateTime.now().toUnixInteger()
			cancelKeepAlive()  
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
