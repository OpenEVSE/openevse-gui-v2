<script>
	import {onMount, onDestroy} from 'svelte'
	import {status_store} from '../../lib/stores/status.js'
	import {config_store} from "../../lib/stores/config.js"
	import {uistates_store} from "../../lib/stores/uistates.js"
	let socket
	let timerId
	let timeout

	onMount(() => {
		connect2socket(socket)
	})

	onDestroy(()=> {
		socket.close()
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
				const jsondata = JSON.parse(event.data.toString())
				let store = Object.assign({}, $status_store);
				store = {...store, ...jsondata}
				status_store.update(() => store)
				// reload config if config_version has changed
				if(jsondata.config_version) {
					refreshConfig(jsondata.config_version)
				}
			})
			s.addEventListener("error", function (event) {
				console.log("socket error")
				cancelKeepAlive()
				if (!timeout)
					timeout = setTimeout(() => {
						connect2socket(s)
					}, 2000);
				
			})
			s.addEventListener("close", function (event) {
				console.log("socket closed, reconnecting in 2s")
				cancelKeepAlive()
				if (!timeout)
					timeout = setTimeout(() => {
						connect2socket(s)
					}, 2000);
			})
		}
	}

	function keepAlive(socket) { 
		
		var timeout = 5000;  
		if (socket && socket.readyState == socket.OPEN) {  
			socket.send("{\"ping\":1}");  
		}  
		timerId = setTimeout(()=>keepAlive(socket), timeout);  
	}
	
	function cancelKeepAlive() {  
		if (timerId) {  
			clearTimeout(timerId);  
    }  
}

	function refreshConfig(version) {
			if(version != $uistates_store.config_version) {
				config_store.download()		
				$uistates_store.config_version = version
			}	
	}

</script>
