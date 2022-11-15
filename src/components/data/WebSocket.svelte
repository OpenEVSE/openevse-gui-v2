<script>
	import { status_store } from './../../lib/stores/status.js'
	import { onMount, onDestroy } from 'svelte'
	

	let socket
	let timerId
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
				const jsondata = JSON.parse(event.data.toString())
				let store = Object.assign({}, $status_store);
				store = {...store, ...jsondata}
				status_store.update(() => store)
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
	// async function updateClaimStore(ver) {
	// 	if (!isgettingclaim) {
	// 		if (ver != $uistates_store.claims_version) {
	// 			$uistates_store.claims_version = ver
	// 			isgettingclaim = true
	// 			//await claim_store.getClaim()
	// 			await claims_target_store.download()
	// 			getMode()
				
	// 			isgettingclaim = false
	// 			return true
	// 		}
	// 	}
	// }

	// async function updateScheduleStore(ver) {
	// 	if (!isgettingschedule) {
	// 		if (ver != $uistates_store.schedule_version) {
	// 			$uistates_store.schedule_version = ver
	// 			isgettingschedule = true
	// 			//await claim_store.getClaim()
	// 			await schedule_store.download()
	// 			isgettingschedule = false
	// 			timeout = setTimeout(updateSchedulePlanStore,200)
	// 			return true
	// 		}
	// 	}
	// }

	// async function updateSchedulePlanStore(ver) {
	// 	if (!isgettingplan) {
	// 		if (ver != $uistates_store.schedule_plan_version) {
	// 			$uistates_store.schedule_plan_version = ver
	// 			isgettingplan = true
	// 			//await claim_store.getClaim()
	// 			await plan_store.download()
	// 			isgettingplan = false
	// 			return true
	// 		}
	// 	}
	// }
</script>
