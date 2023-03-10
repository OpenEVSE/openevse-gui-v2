<script>
	import { uistates_store } 	  from "./../../lib/stores/uistates.js";
	import { DateTime } 		  from "luxon";
	import { status_store }		  from './../../lib/stores/status.js'
	import { onMount, onDestroy } from 'svelte'
	import { JSONTryParse }		  from './../../lib/utils.js'
	
	let socket
	let timerId
	let lastmsg
	let timeout
	let ping_cnt = 0


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
		// if (!s) {
			console.log("opening socket")
			s = new WebSocket(proto + host + "/ws")
			s.addEventListener("open", function (event) {
				console.log("connected to websocket")
				$uistates_store.ws_connected = true
				keepAlive(s)
			} )
			s.addEventListener("message", function (e) {
				lastmsg = DateTime.now().toUnixInteger()
				if (parseMessage(e.data.toString())) {
					ping_cnt = 0
				}
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
		// }
	}

	function parseMessage(msg) {
		const jsondata = JSONTryParse(msg)
		if (jsondata) {
			lastmsg = DateTime.now().toUnixInteger()
			if (!jsondata.pong) {
				// todo: could verify data first
				let store = Object.assign({}, $status_store);
				store = {...store, ...jsondata}
				status_store.update(() => store)
				return true
			}
			else return true
			
		}
		else {
			console.log("Can't parse ws msg")
			return false
		}
	}


	function keepAlive(s) { 
		let now = DateTime.now().toUnixInteger()
		let timing = now - lastmsg
		if ((!ping_cnt && timing >= 5) || ( ping_cnt && ping_cnt <= 3 )) {
			// send a ping to check connectivity
			if (s && s.readyState == s.OPEN) {  
				s.send('{"ping": 1}')
				ping_cnt += 1
			}  	
		}
		else if (ping_cnt > 3 && timing >= 5) {
			// restart ws connection
			console.log("No msg over websocket for " + timing + " sec, restart websocket")
			ping_cnt = 0
			$uistates_store.ws_connected = false
			s.close()
			lastmsg = DateTime.now().toUnixInteger()
			cancelKeepAlive()
			return
		}
		timerId = setTimeout(()=>keepAlive(s), ping_cnt?1000:5000);
	}
	
	function cancelKeepAlive() {  
		if (timerId) {  
			clearTimeout(timerId);  
		}
    }  
</script>
