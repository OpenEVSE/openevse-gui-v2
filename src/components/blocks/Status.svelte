<script>
	import {status_store} from "../../lib/stores/status.js"
	import {plan_store} from "../../lib/stores/plan.js"
	import {config_store} from "../../lib/stores/config.js"
	import {uistates_store} from "../../lib/stores/uistates.js"
	import StatusTile from "../ui/StatusTile.svelte"
	import StatusItems from "../ui/StatusItems.svelte"
	import ExpandArrow from "../ui/ExpandArrow.svelte"
	
	let time
	let elapsed
	let date
	let expand = false

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
		if(s) 
    		return s.split('|')[0]
		else
			return "UTC"
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


</style>

<div class="statusbox {$status_store.status == "disabled" ? "disabled":"active"} has-background-light mb-5 mt-0 px-3">
	<div class="mb-2 mx-0">
		<StatusItems state={$status_store.state} vehicle={$status_store.vehicle} time={time} bp={$uistates_store.breakpoint} />	
	</div>

	<div class="mx-0 is-flex is-align-content-space-between is-justify-content-center">
		<StatusTile title="Elapsed" value={elapsed} />
		<StatusTile title="Delivered" value={($status_store.session_energy/1000).toFixed(1)} unit="kWh" />
		<StatusTile title="Current" value={$status_store.amp/1000} unit="A" />
		{#if $uistates_store.breakpoint != "mobile"}
		<!-- // Desktop & Tablet only -->
		<StatusTile title="Power" value={($status_store.amp/1000) * $status_store.voltage} unit="W" />
		{/if}
		{#if $uistates_store.breakpoint == "desktop"}
		<!-- // Desktop only -->
		<StatusTile title="Setpoint" value={$status_store.pilot} unit="A" />
		{/if}
	</div>

	{#if expand}
	<div class="mx-0 is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-center" >
		{#if $uistates_store.breakpoint == "mobile"}
		<!-- // Mobile only -->
		<StatusTile title="Power" value={($status_store.amp/1000) * $status_store.voltage} unit="W" />
		{/if}
		{#if $uistates_store.breakpoint != "desktop"}
		<!-- // Tablet & Mobile only -->
		<StatusTile title="Setpoint" value={$status_store.pilot} unit="A" />
		{/if}
		{#if $status_store.shaper}
		<StatusTile title="Available" value={$status_store.shaper_chg_cur} unit="A" />
		{/if}
		<StatusTile title="Total" value={Math.round($status_store.total_energy)} unit="kWh" />
		<StatusTile title="Voltage" value={$status_store.voltage} unit="V" />	
		{#if $status_store.battery_level}
		<StatusTile title="EV SOC" value={$status_store.battery_level} unit="%" />
		<StatusTile title="EV Range" value={$status_store.battery_range} unit="km" />
		{/if}
		<StatusTile title="Internal T°" value={$status_store.temp/10} unit="°C" />
	</div>
	{/if}

	<div class="pb-2 pt-5 ">
		<div class="columns is-size-6 px-0 mx-0 ">
			<div class="pl-0 pr-3"><span class="has-text-weight-bold is-size-7 ">Current Event: </span> <span class="tag is-white has-text-danger is-capitalized">{$plan_store.current_event.state} {$plan_store.current_event.time}</span></div>
			<div class="px-0"><span class="has-text-weight-bold is-size-7">Next Event: </span> <span class="tag is-white has-text-primary is-capitalized">{$plan_store.next_event.state} {$plan_store.next_event.time}</span></div>
		</div>
	</div>
	<ExpandArrow bind:expand={expand} />

</div>
