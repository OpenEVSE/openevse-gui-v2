<script>
	export let state
	export let status
	export let vehicle = 0
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
			message = "EV connected"
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
			message = "Standby "
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

<div class="level-item py-0 pb-2 px-0 is-narrow is-size-6 has-text-weight-semibold notification">
	<span class="tag mr-2 ml-0 is-capitalized {status=="active"?'is-primary':'is-danger'}">{status}</span>
	<span class="tag mx-2 has-text-weight-semibold {color}">{message}</span>
</div>