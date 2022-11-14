<script>
	import { plan_store } from "./../../lib/stores-simu/plan.js"
	import {EvseClients} from  "./../../lib/vars.js"
	import { status_store } from './../../lib/stores/status.js'
	import { config_store } from "./../../lib/stores/config.js"
	import { schedule_store } from "./../../lib/stores/schedule.js"
	import { uistates_store } from "./../../lib/stores/uistates.js"
	import { claims_target_store } from "./../../lib/stores/claims_target.js"
	import { onMount, onDestroy } from 'svelte'
	

	let socket
	let timerId
	let timeout
	let isgettingclaim = false
	let isgettingschedule = false
	let isgettingplan = false

	onMount(() => {
		connect2socket(socket)
		getMode($claims_target_store.properties.state)
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

	async function updateClaimStore(ver) {
		if (!isgettingclaim) {
			if (ver != $uistates_store.claims_version) {
				$uistates_store.claims_version = ver
				isgettingclaim = true
				//await claim_store.getClaim()
				await claims_target_store.download()
				getMode($claims_target_store.properties.state)
				isgettingclaim = false
				return true
			}
		}
	}

	async function updateScheduleStore(ver) {
		if (!isgettingschedule) {
			if (ver != $uistates_store.schedule_version) {
				$uistates_store.schedule_version = ver
				isgettingschedule = true
				//await claim_store.getClaim()
				await schedule_store.download()
				isgettingschedule = false
				timeout = setTimeout(updateSchedulePlanStore,200)
				return true
			}
		}
	}

	async function updateSchedulePlanStore(ver) {
		if (!isgettingplan) {
			if (ver != $uistates_store.schedule_version) {
				$uistates_store.schedule_version = ver
				isgettingplan = true
				//await claim_store.getClaim()
				await plan_store.download()
				isgettingplan = false
				return true
			}
		}
	}

	function getMode(state) {
		if ($claims_target_store.claims.state == EvseClients["manual"] || $claims_target_store.claims.state == undefined) {
			switch (state) {
				case "active":
					$uistates_store.mode = 1 // On
					break
				case "disabled":
					$uistates_store.mode = 2 // Off
					break;
				default: 
					break
			}
		}
		else $uistates_store.mode = 0
	}
	// Reactive callbacks to update stores
	$: updateClaimStore($status_store.claims_version)
	$: updateScheduleStore($status_store.schedule_version)

</script>
