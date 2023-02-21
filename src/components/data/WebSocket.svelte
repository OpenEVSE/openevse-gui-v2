<script>
	import { uistates_store } 	  from "./../../lib/stores/uistates.js";
	import { DateTime } 		  from "luxon";
	import { status_store }		  from './../../lib/stores/status.js'
	import { onMount, onDestroy } from 'svelte'
	
	let socket
	let timerId
	let lastmsg
	let timeout


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
		let host 	= window.location.host
		let ishttps = location.protocol === "https:"
		let proto 	= ishttps?"wss://":"ws://"
		if (!s) {
			console.log("opening socket")
			s = new WebSocket(proto + host + "/ws")
			s.addEventListener("open", function (event) {
				console.log("connected to websocket")
				$uistates_store.ws_connected = true
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
				$uistates_store.ws_connected = false
				cancelKeepAlive()
			})
			s.addEventListener("close", function (e) {
				console.log('Socket is closed. Reconnect attempt in 1 second.', e.reason);
				lastmsg = DateTime.now().toUnixInteger()
				cancelKeepAlive()
				$uistates_store.ws_connected = false
				setTimeout(()=>connect2socket(), 1000)
				
			})
		}
	}

	function keepAlive(s) { 
		let newmsg = DateTime.now().toUnixInteger()
		let timing = newmsg - lastmsg
		if (timing >= 120) {
			// Roger we have a problem, try to reconnect the websocket
			console.log("No msg over websocket for " + timing + " sec, restart websocket")
			s.close()
			lastmsg = DateTime.now().toUnixInteger()
			cancelKeepAlive()  
			return
		}
		
		// if (s && s.readyState == s.OPEN) {  
		// 	s.send("{\"ping\":1}");  
		// }  
		timerId = setTimeout(()=>keepAlive(s), 5000);  
		return
	}
	
	function cancelKeepAlive() {  
		if (timerId) {  
			clearTimeout(timerId);  
		}
    }  
</script>
