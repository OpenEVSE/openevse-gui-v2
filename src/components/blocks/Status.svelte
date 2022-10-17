<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import { faAngleDown, faAngleUp, faAngleRight } from '@fortawesome/free-solid-svg-icons/index.js'
	import {status_store} from "../../lib/stores/status.js"
	import {plan_store} from "../../lib/stores/plan.js"
	import {config_store} from "../../lib/stores/config.js"
	import StatusTile from "../ui/StatusTile.svelte"
	import StatusItems from "../ui/StatusItems.svelte"
	
	let time
	let elapsed
	let date
	let expand = false
	let size = "sm"

	$: date = new Date($status_store.time)
	$: updateDate(date)
	$: { 
		if ($status_store.elapsed != undefined)
			elapsed = new Date($status_store.elapsed * 1000).toISOString().slice(11, 16) 
		}

	function updateDate(m) {
		time = 	utc2evseLocalTime(date, $config_store.time_zone)
	}

	function utc2evseLocalTime(d,s) {
		let lt = d.toLocaleString(navigator.language, { 
			timeZone: getTZ(s),
			year: '2-digit',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			})
		return lt
	}
	function getTZ(s) { 
    	let tz = s.split('|')[0]
		return tz
	}

	
</script>

<style>
	.statusbox {
	border-radius: 6px;
	color: black;
	background-color: hsl(0, 0%, 96%);
	display: block;
	padding: 1.25rem;
	margin-bottom: 3rem;
	position: relative;
	}
	
	.statusbox.disabled {
		box-shadow: 0 0.5em 1em -0.125em rgba(255,56,96,0.3), 0 0px 0 1px rgba(0,0,0, 0.02);
	}
	.statusbox.active {
		box-shadow: 0 0.5em 1em -0.125em rgba(0,209,178,0.3), 0 0px 0 1px rgba(0,0,0, 0.02);
	}
	.arrow {
		position: absolute;
        bottom: 5px;
		right: 5px;
	}
</style>



<div class="statusbox {$status_store.status == "disabled" ? "disabled":"active"} has-background-light mb-5 px-3">
	<div class="mb-2 mx-0">
		<StatusItems state={$status_store.state} vehicle={$status_store.vehicle} time={time} />	
	</div>

	<div class="level is-mobile mx-0">
		<StatusTile title="Current" value={$status_store.amp/1000} unit="A" />
		<StatusTile title="Energy" value={($status_store.session_energy/1000).toFixed(1)} unit="kW/h" />
		<StatusTile title="Temp°" value={$status_store.temp/10} unit="°C" />
		<StatusTile title="Elapsed" value={elapsed} />
	</div>

	{#if expand}
	<div class="level is-mobile mx-0">
		<StatusTile title="Setpoint" value={$status_store.pilot} unit="A" />
		<StatusTile title="Voltage" value={$status_store.voltage} unit="°C" />
		<StatusTile title="Total" value={$status_store.total_energy.toFixed(1)} unit="kW/h" />
		{#if $status_store.battery_level}
		<StatusTile title="SOC" value={$status_store.battery_level} unit="%" />
		{/if}
	</div>
	{/if}

	<div class="container py-2">
		<div class="columns is-flex-direction-row is-size-6 px-0 mx-0">
			<div class="px-0"><span class="has-text-weight-bold is-size-7 is-align-content-flex-start">Current Event: </span> <span class="tag is-white has-text-danger is-capitalized">{$plan_store.current_event.state} {$plan_store.current_event.time}</span></div>
			<div class="px-0"><span class="has-text-weight-bold is-size-7 is-align-content-flex-end">Next Event: </span> <span class="tag is-white has-text-primary is-capitalized">{$plan_store.next_event.state} {$plan_store.next_event.time}</span></div>
		</div>
	</div>
	<div class="container arrow">
		{#if !expand}
			<button class="button is-dark has-background-light is-inverted" tabindex="0" on:click={() => {expand=true; size="sm"}} on:mouseenter={() => size = "lg"} on:mouseleave={() => size = "sm"}>
				<Fa size={size} icon={faAngleDown} />
			</button>
		{:else}
			<button class="button is-dark has-background-light is-inverted" tabindex="0" on:click={() => {expand=false; size="sm"}} on:mouseenter={() => size = "lg"} on:mouseleave={() => size = "sm"}>
				<Fa size={size} icon={faAngleUp} />
			</button>
		{/if}
	</div>

</div>
