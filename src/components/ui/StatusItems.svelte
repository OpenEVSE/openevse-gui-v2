<script>
	import { faCar, faHourglassHalf, faThumbsUp, faBan, faBolt, faTriangleExclamation, faCircleXmark } from '@fortawesome/free-solid-svg-icons/index.js'
	import StatusIcon from "./StatusIcon.svelte"
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

	$: switch (state) {
		case 0: // Unknown
			break
		case 1: // Not connected
			status = "active"
			charging = false
			message = "Waiting for EV"
			color = "is-primary"
			iconcolor = "has-text-white"
			icon = faHourglassHalf
			break
		case 2: // Connected
			status = "active"
			charging = false
			message = "Ready to charge"
			color = "is-primary"
			iconcolor = "has-text-white"
			icon = faThumbsUp
			break;
		case 3: // Charging
			status = "active"
			charging = true
			message = "Charging..."
			color = "is-primary"
			iconcolor = "has-text-warning"
			icon = faBolt
			break;
		case 4: // Error
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
			status = "disabled"
			charging = false
			message = "Error " + state
			color = "is-danger"
			iconcolor = "has-text-white"
			icon = faTriangleExclamation
			break;
		case 254: // sleeping
			status = "disabled"
			charging = false
			message = "EVSE Disabled"
			color = "is-danger"
			iconcolor = "has-text-white"
			icon = faBan
			break;
		case 255: 
			status = "disabled"
			charging = false
			message = "EVSE Disabled "
			color = "is-danger"
			iconcolor = "has-text-white"
			icon = faCircleXmark
			break;
	}


</script>
<style>
	.no-pointer {
		cursor: default
	}
</style>


<div class="is-flex is-justify-content-center">
	<!-- <div class="tag mx-1 mb-1 has-text-weight-semibold is-capitalized is-narrow  {status=="active"?'is-primary':'is-danger'}">{status}</div> -->
	<!-- <div class="tag  no-pointer {bp != "mobilemini"?"is-large":"is-normal"} mb-1 mx-1 has-tooltip-right-mobile has-tooltip-arrow {status=="active"?'is-primary':'is-danger'}" data-tooltip={status=="active"?"OpenEVSE Active":"OpenEVSE in Standby"}>
		<StatusIcon icon={status=="active"?faCircleCheck:faBan} color="has-text-white" />
	</div> -->
	<div class="tag no-pointer {bp != "mobilemini"?"is-large":"is-medium"} mb-1 mx-1 has-tooltip-arrow has-tooltip-bottom {color}" data-tooltip={message}>

		<StatusIcon icon={icon} color={iconcolor} bp={bp}/>
	</div>
	<!-- <span class="tag mb-1 mx-1 has-text-weight-semibold is-capitalized {vehicle?"is-primary":"is-danger"}">{vehicle?"Connected":"Disconnected"}</span> -->
	<div class="tag no-pointer {bp != "mobilemini"?"is-large":"is-medium"} mb-1 mx-1 has-tooltip-arrow has-tooltip-bottom {vehicle?"is-primary":"is-danger"}" data-tooltip={vehicle?"Vehicle Connected":"No Vehicle Connected"}>
		<StatusIcon icon={vehicle?faCar:faCar} color="has-text-white" bp={bp}/>
	</div>
	<!-- <div class="tag mx-1 mb-1 has-text-weight-semibold is-capitalized is-narrow  {color}">{message}</div> -->

	<div class="no-pointer {bp != "mobilemini"?"mt-1 is-medium":"mt-0 is-medium"} mb-1 ml-auto mr-2 is-capitalized  has-text-weight-semibold has-text-dark is-dark has-tooltip-arrow has-tooltip-bottom" data-tooltip="OpenEVSE local time">{time}</div>
</div>