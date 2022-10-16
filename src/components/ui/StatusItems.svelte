<script>
	export let state
	export let time
	export let vehicle = 0
	let status = "disabled"
	let message = ""
	let charging = false
	let color = "is-danger"

	$: switch (state) {
		case 0: // Unknown
			break
		case 1: // Not connected
			status = "active"
			charging = false
			message = "no EV connected"
			color = "is-info"
			break
		case 2: // Connected
			status = "active"
			charging = false
			message = "Ready"
			color = "is-primary"
			break;
		case 3: // Charging
			status = "active"
			charging = true
			message = "Charging"
			color = "is-primary"
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
			break;
		case 254: // sleeping
			status = "disabled"
			charging = false
			message = "Sleeping "
			color = "is-danger"
			break;
		case 255: 
			status = "disabled"
			charging = false
			message = "Disabled "
			color = "is-danger"
			break;
	}
</script>

<div class="is-flex is-flex-wrap-wrap is-justify-content-center">
	<div class="tag mx-1 mb-1 has-text-weight-semibold is-capitalized is-narrow  {status=="active"?'is-primary':'is-danger'}">{status}</div>
	<div class="tag mx-1 mb-1 has-text-weight-semibold is-capitalized is-narrow  {color}">{message}</div>
	<div class="tag mx-1 mb-1 has-text-weight-semibold is-capitalized is-narrow  {vehicle?"is-primary":"is-danger"}">{vehicle?"Connected":"Disconnected"}</div>
	<div class="tag mx-1 mb-1 has-text-weight-semibold is-capitalized is-narrow is-info">{time}</div>
</div>