<script>
	import { onMount } 				from "svelte"
	import { _ } 					from 'svelte-i18n'
	import { config_store } 		from "./../../lib/stores/config.js"
	import {status_store} 			from "./../../lib/stores/status.js"
	import {plan_store} 			from "./../../lib/stores/plan.js"
	import {uistates_store} 		from "./../../lib/stores/uistates.js"
	import { claims_target_store }  from "./../../lib/stores/claims_target.js"
	import {sec2time,
			displayRange} 			from "../../lib/utils.js"
	import { keyed } 				from 'svelte-keyed'
	import DivertShaperStatus 		from "./../ui/DivertShaperStatus.svelte"
	import TaskDisplay 				from "../ui/TaskDisplay.svelte"
	import StatusTile 				from "../ui/StatusTile.svelte"
	import StatusItems 				from "../ui/StatusItems.svelte"
	import ExpandArrow 				from "../ui/ExpandArrow.svelte"

	let mounted = false
	let redraw = 0
	let expand_div

	// set keyed derived stores
	const elapsed = keyed(uistates_store, 'elapsed');


	let isTileVisible = (tile,pos) => {
		if (
			(pos <= 2 ) ||
			(pos == 3 && ($uistates_store.breakpoint != "mobile" && $uistates_store.breakpoint != "mobilemini")) ||
			(pos == 4 && $uistates_store.breakpoint == "desktop")
		) {
			return true
		}
		else {
			return false
		}
	}

	let state2color = (state) => {
		switch (state) {
			case 1:
				return "active"
			case 2:
				return "connected"
			case 3:
				return "charging"
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 11:
				return "error"
			case 254:
			case 255:
				return "disabled"
			default:
				return ""
		}
	}

	let has_html = (el) => {
		if (el) {
			const hasHTML = el.innerHTML.trim() !== '';
			return hasHTML
		}
		else return false
		
	}

	onMount(()=> {
		mounted = true
	})

	$: tiles = [
		{ title: "elapsed", value: sec2time($elapsed)},
		{ title: "delivered", value: $status_store.session_energy/1000, precision: 2, unit: $_("units.kwh") },
		{ title: "current", value: $status_store.amp/1000, precision: 1, unit: $_("units.A") },
		{ title: "power", value: $status_store.power, unit: $_("units.W") },
		{ title: "setpoint", value: $status_store.pilot, unit: $_("units.A") },
		{ title: "selfprod", value: $status_store.charge_rate,  unit: $_("units.A"), precision: 1, display: $config_store.divert_enabled },
		{ title: "shaper", value: $status_store.shaper_cur,  unit: $_("units.A"), precision: 1, display: $config_store.current_shaper_enabled },
		{ title: "battery", value: $status_store.battery_level, unit: "%", display: $status_store.battery_level?true:false},
		{ title: "range", value: displayRange($status_store.battery_range), unit: $config_store.mqtt_vehicle_range_miles?$_("units.miles"):$_("units.km"), display: $status_store.battery_range?true:false},
		{ title: "remaining", value: sec2time($status_store.time_to_full_charge), display: $status_store.time_to_full_charge?true:false }
	]

	
</script>

<style lang="scss">
	.statusbox {
		border-radius: 6px;
		// color: black;
		background-color: hsl(0, 0%, 96%);
	}
	
	.statusbox.disabled {
		box-shadow: 0 0.5em 1em -0.125em hsl(201, 82%, 22%);
		// border: dashed 0.2em;
		border: solid 0.1em;
		border-color: hsl(201, 82%, 22%);
		transition: opacity 0.5s ease-in-out;
	}
	.statusbox.error {
		box-shadow: 0 0.5em 1em -0.125em hsl(348, 100%, 61%);
		// border: dashed 0.2em;
		border: solid 0.1em;
		border-color: hsl(348, 100%, 61%);
		transition: opacity 0.5s ease-in-out;
	}
	.statusbox.active {
		box-shadow: 0 0.5em 1em -0.125em hsl(153, 62%,54%);
		// border: dashed 0.2em;
		border: solid 0.1em;
		border-color:hsl(153, 62%, 54%);
		transition: opacity 0.5s ease-in-out;
	}
	.statusbox.connected {
		box-shadow: 0 0.5em 1em -0.125em hsl(57, 93%, 48%);
		// border: dashed 0.2em;
		border: solid 0.1em;
		border-color:hsl(57, 93%, 48%);
		transition: opacity 0.5s ease-in-out;
	}
	.statusbox.charging {
		 box-shadow: 0 0.5em 1em -0.125em  hsl(57, 93%, 48%);
		 border: solid 0.1em;
		// border-color:hsl(57, 93%, 48%);
		border-color:#0cfbe7;
		animation: charge 3s infinite;
		transition: opacity 0.5s ease-in-out;
	}
	@keyframes charge {
            50% {
               box-shadow: 0 0.5em 3em -0.125em #0cfbe7;
            }
		}

</style>
<svelte:window on:resize={()=>redraw++} />
{#if $status_store.evse_connected == 1 && $uistates_store.data_loaded && mounted}
<div class="container statusbox {state2color($status_store.state)} has-background-color-light px-1 pt-2 pb-1 has-background-light">
	<div>
		<div class="mb-2 mx-0">
			<StatusItems state={$status_store.state} vehicle={$status_store.vehicle} time={$uistates_store.time_localestring} bp={$uistates_store.breakpoint} />
		</div>
		<div class="mx-0 is-flex is-align-content-space-between is-justify-content-center is-flex-wrap-wrap">
			{#key redraw}
			{#each tiles as tile, i}
			{#if isTileVisible(tile,i) && (tile.display || tile.display == undefined)}
			<StatusTile title={$_("status-tile-" + tile.title)} value={tile.value} precision={tile.precision} unit={tile.unit}/>	
			{/if}
			{/each}
			{/key}
		</div>
		<div bind:this={expand_div} class="mx-0 is-flex is-align-content-space-between is-justify-content-center is-flex-wrap-wrap" class:is-hidden={!$uistates_store.status_expanded}>
			{#key $uistates_store.status_expanded || redraw}
			{#each tiles as tile, i}
			{#if !isTileVisible(tile,i) && (tile.display || tile.display == undefined)}
			<StatusTile title={$_("status-tile-" + tile.title)} value={tile.value} precision={tile.precision} unit={tile.unit}/>	
			{/if}
			{/each}
			{/key}
		</div>
		
		<div class="is-flex mt-3 mt-4 mb-1 ml-4 ">
			<div class="columns">
				{#if !$claims_target_store.claims?.state}
				<TaskDisplay mode={$_("clients.default")} state={$status_store.status} />
				{:else if $uistates_store.stateclaimfrom == "manual"}
				<TaskDisplay mode={$_("clients.manual")} state={$status_store.status} />
				{:else if $uistates_store.stateclaimfrom == "rfid"}
				<TaskDisplay 
					mode={$_("clients." + $uistates_store.stateclaimfrom )}  
					msg={!$status_store.rfid_auth?$_("status-task-rfid-msg"):$_("status-task-rfidok-msg")} 
					state={!$status_store.rfid_auth?$claims_target_store.properties.state:""} />
				{:else if $uistates_store.stateclaimfrom == "divert"}
				<TaskDisplay 
					mode={$_("clients." + $uistates_store.stateclaimfrom )}  
					state={$status_store.status == "disabled"?$_("standby"):$status_store.status} />
				{:else if $uistates_store.stateclaimfrom != "timer"}
				<TaskDisplay 
					mode={$_("clients." + $uistates_store.stateclaimfrom)} 
					state={$claims_target_store.properties?.state} />

				{:else if $uistates_store.stateclaimfrom == "timer"}
				<TaskDisplay 
					mode={$_("clients.timer")}
					msg={$plan_store.current_event?.state=="active"?$_("status-task-timer-activated"):$_("status-task-timer-disabled")} 
					state={$plan_store.current_event?.state} 
					time={$plan_store.current_event?.time} />

					{#if $plan_store.current_event?.state != $plan_store.next_event?.state}
					<TaskDisplay 
						mode="timer" 
						msg={$plan_store.next_event.state=="active"?$_("status-task-timer-activate"):$_("status-task-timer-disable")} 
						state={$plan_store.next_event?.state} 
						time={$plan_store.next_event?.time} />
					{/if}
				{/if}
			</div>
		</div>
		{#if $uistates_store.status_expanded}
		<DivertShaperStatus />
		{/if}
		{#key $uistates_store.status_expanded || redraw}
		<div class="mt-1" class:is-hidden={!has_html(expand_div)}>
			<ExpandArrow bind:expand={$uistates_store.status_expanded} />
		</div>
		{/key}
	</div>
</div>
{:else}
<div class="statusbox disabled has-background-light mb-5 mt-0 px-3 has-text-centered">
	<h4 class="title">EVSE Error</h4>
	<h5>OpenEVSE module is not responding</h5>
	<div class="block">Please check your setup before going further</div>
	<button class="button is-info is-outlined my-3" on:click={()=>location.reload()}>Force Reload</button>
</div>
{/if}


