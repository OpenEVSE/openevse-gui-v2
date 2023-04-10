<script>
	import { config_store }   from "./../../lib/stores/config.js";
	import { _ } 			  from 'svelte-i18n'
	import { uistates_store } from "./../../lib/stores/uistates.js";
	import StatusIcon 		  from "./StatusIcon.svelte"
	import Logo 			  from "./../../assets/logo-mini.png"
	import { link } 		  from "svelte-spa-router"
	import { getStateDesc }	  from "./../../lib/utils.js"

	export let state
	export let time
	export let vehicle
	export let bp
	let status = "disabled"
	let message = ""
	let charging = false
	let color = "is-danger"
	let iconcolor = "has-text-danger"
	let icon

	function getStateInfo(state) {

		message = getStateDesc(state)
		switch (state) {
			case 0: // Starting
				status = "disabled"
				charging = false
				color = "is-info"
				iconcolor = "has-text-white"
				icon = "majesticons:rocket-3-start-line"
				break
			case 1: // Not connected
				status = "active"
				charging = false
				color = "is-primary"
				iconcolor = "has-text-white"
				icon = "fa6-solid:hourglass-half"
				break
			case 2: // Connected
				status = "active"
				charging = false
				color = "is-primary"
				iconcolor = "has-text-white"
				icon = "fa6-solid:thumbs-up"
				break;
			case 3: // Charging
				status = "active"
				charging = true
				color = "is-primary"
				iconcolor = "has-text-warning"
				icon = "fa6-solid:bolt"
				break;
			case 4: // Error
				status = "disabled"
				charging = false
				color = "is-danger"
				iconcolor = "has-text-white"
				icon = "fluent:shield-error-24-filled"
				break;
			case 5:
				status = "disabled"
				charging = false
				color = "is-danger"
				iconcolor = "has-text-white"
				icon = "fluent:shield-error-24-filled"
				break;
			case 6:
				status = "disabled"
				charging = false
				color = "is-danger"
				iconcolor = "has-text-white"
				icon = "fluent:shield-error-24-filled"
				break;
			case 7:
				status = "disabled"
				charging = false
				color = "is-danger"
				iconcolor = "has-text-white"
				icon = "fluent:shield-error-24-filled"
				break;
			case 8:
				status = "disabled"
				charging = false
				color = "is-danger"
				iconcolor = "has-text-white"
				icon = "fluent:shield-error-24-filled"
				break;
			case 9:
				status = "disabled"
				charging = false
				color = "is-danger"
				iconcolor = "has-text-white"
				icon = "fluent:shield-error-24-filled"
				break;
			case 10:
				status = "disabled"
				charging = false
				color = "is-danger"
				iconcolor = "has-text-white"
				icon = "fluent:shield-error-24-filled"
				break;
			case 11:
				status = "disabled"
				charging = false
				color = "is-danger"
				iconcolor = "has-text-white"
				icon = "fluent:shield-error-24-filled"
				break;
			case 254: // sleeping
				status = "disabled"
				charging = false
				color = "is-dark"
				iconcolor = "has-text-white"
				icon = "fa6-solid:ban"
				break;
			case 255: 
				status = "disabled"
				charging = false
				color = "is-dark"
				iconcolor = "has-text-white"
				icon = "fa6-solid:circle-xmark"
				break;
		}
	}
		
	$: getStateInfo(state)


</script>

<style>
	.no-pointer {
		cursor: default
	}

</style>

<div class="is-flex is-justify-content-center is-align-items-center" >
	<div class="tag no-pointer {bp != "mobilemini"?"is-large":"is-medium"} mb-1 mx-1 has-tooltip-arrow has-tooltip-right {color}" data-tooltip={message}>
		<StatusIcon icon={icon} color={iconcolor} bp={bp}/>
	</div>
	<div class="tag no-pointer {bp != "mobilemini"?"is-large":"is-medium"} mb-1 mx-1 has-tooltip-arrow has-tooltip-right {vehicle?"is-primary":"is-dark"}" data-tooltip={vehicle?$_("status-items-connected"):$_("status-items-notconnected")}>
		<StatusIcon icon={vehicle?"mdi:car":"mdi:car-off"} color="has-text-white" bp={bp}/>
	</div>
	<div class="is-flex-grow-1 has-text-centered {$uistates_store.breakpoint == "mobile" || $uistates_store.breakpoint == "mobilemini" ?"is-hidden":""}" >
		<a href="/" use:link>
			<img src={Logo}  alt="logo" />
		</a>
	</div>
	
	<div class="is-flex no-pointer {bp != "mobilemini"?"mt-1 is-medium":"mt-0 is-medium"} mb-1 ml-auto mr-2 is-capitalized  has-text-weight-semibold has-text-dark is-dark">
		<div class="my-0 py-0 is-flex is-flex-direction-column is-align-items-center is-justify-content-top" >
			<span>{$config_store.hostname}</span>
			<span>{time}</span>
		</div>
	</div>
</div>