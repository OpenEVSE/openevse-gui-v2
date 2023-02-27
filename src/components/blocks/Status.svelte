<script>
	import { onMount } 				from "svelte";
	import { _ } 					from 'svelte-i18n'
	import { config_store } 		from "./../../lib/stores/config.js";
	import {status_store} 			from "./../../lib/stores/status.js"
	import {plan_store} 			from "./../../lib/stores/plan.js"
	import {uistates_store} 		from "./../../lib/stores/uistates.js"
	import {sec2time,
			miles2km, 
			displayRange} 			from "../../lib/utils.js"
	import { scale } 				from 'svelte/transition';
	import { expoInOut } 			from 'svelte/easing';
	import { claims_target_store }  from "./../../lib/stores/claims_target.js";
	import DivertShaperStatus 		from "./../ui/DivertShaperStatus.svelte";
	import TaskDisplay 				from "../ui/TaskDisplay.svelte";
	import StatusTile 				from "../ui/StatusTile.svelte"
	import StatusItems 				from "../ui/StatusItems.svelte"
	import ExpandArrow 				from "../ui/ExpandArrow.svelte"

	let hidden_tiles = 0
	let mounted = false

	let isTileVisible = (tile,pos) => {
		if (
			(pos <= 2 ) ||
			(pos == 3 && ($uistates_store.breakpoint != "mobile" || $uistates_store.breakpoint != "mobilemini")) ||
			(pos == 4 && $uistates_store.breakpoint == "desktop")
		) {
			if (tile.display == undefined || tile.display) {
				return true
			}
			else return false
				
		}
		else {
			if (tile.display == undefined || tile.display) {
				hidden_tiles = 1
				if ($uistates_store.status_expanded == true)
					return true
				else return false
			}
			else {
				return false
			}
		}
	}

	onMount(()=> {
		mounted = true
	})

	$: tiles = [
		{ title: "elapsed", value: sec2time($status_store.elapsed)},
		{ title: "delivered", value: $status_store.session_energy/1000, precision: 1, unit: $_("units.kwh") },
		{ title: "current", value: $status_store.amp/1000, precision: 1, unit: $_("units.A") },
		{ title: "power", value: $uistates_store.power, unit: $_("units.W") },
		{ title: "setpoint", value: $status_store.pilot, unit: $_("units.A") },
		{ title: "selfprod", value: $status_store.charge_rate,  unit: $_("units.A"), display: $config_store.divert_enabled },
		{ title: "shaper", value: $status_store.shaper_cur,  unit: $_("units.A"), display: $config_store.current_shaper_enabled },
		{ title: "battery", value: $status_store.battery_level, unit: "%", display: $status_store.battery_level?true:false},
		{ title: "range", value: displayRange($status_store.battery_range), unit: $config_store.mqtt_vehicle_range_miles?$_("units.miles"):$_("units.km"), display: $status_store.battery_range?true:false},
		{ title: "remaining", value: sec2time($status_store.time_to_full_charge), display: $status_store.time_to_full_charge?true:false }
	]
	$: tiles, hidden_tiles = 0

	
</script>

<style lang="scss">
	.statusbox {
		border-radius: 6px;
		color: black;
		background-color: hsl(0, 0%, 96%);
	}
	
	.statusbox.disabled {
		box-shadow: 0 0.5em 1em -0.125em hsl(348, 100%, 61%), 0 0px 0 1px rgb(255, 255, 255);
		// border: dashed 0.2em;
		border-color: hsl(348, 100%, 61%);
	}
	.statusbox.active {
		box-shadow: 0 0.5em 1em -0.125em hsl(153, 62%,54%), 0 0px 0 1px rgb(255, 255, 255);
		// border: dashed 0.2em;
		border-color:hsl(153, 62%, 54%);
		transition: opacity 0.5s ease-in-out;
	}
	.statusbox.charging {
		 box-shadow: 0 0.5em 1em -0.125em hsl(57, 93%, 30%), 0 0px 0 1px rgb(255, 255, 255);
		// border: dashed 0.2em;
		border-color:hsl(57, 93%, 48%);
		animation: charge 3s infinite ;
	}
	@keyframes charge {
            50% {
               box-shadow: 0 0.5em 1em -0.125em hsl(57, 93%, 48%), 0 0px 0 1px rgb(255, 255, 255);
            }
		}

</style>

{#if $status_store.evse_connected == 1 && $uistates_store.data_loaded && mounted}
<div class="container statusbox {$status_store.status == "disabled" ? "disabled":$status_store.state==3?"charging":"active"} has-background-color-light px-1 pt-2 pb-1 has-background-light" 
in:scale="{{ delay: 0, duration: 300, easing: expoInOut }}" >
	<div>
		<div class="mb-2 mx-0">
			<StatusItems state={$status_store.state} vehicle={$status_store.vehicle} time={$uistates_store.time_localestring} bp={$uistates_store.breakpoint} />
		</div>
		<div class="mx-0 is-flex is-align-content-space-between is-justify-content-center is-flex-wrap-wrap">
		{#each tiles as tile, i}
			<StatusTile title={$_("status-tile-" + tile.title)} value={tile.value} precision={tile.precision} unit={tile.unit} visible={isTileVisible(tile,i)}/>
			
		{/each}
		</div>

		<div class="is-flex mt-3 mt-4 mb-1 ml-4 ">
			<div class="columns">
				{#if $uistates_store.stateclaimfrom == "manual" || !$claims_target_store.claims?.state}
				<TaskDisplay mode={$_("clients.manual")} state={$status_store.status} />
				{:else if $uistates_store.stateclaimfrom == "rfid"}
				<TaskDisplay 
					mode={$_("clients." + $uistates_store.stateclaimfrom )}  
					msg={!$status_store.rfid_auth?$_("status-task-rfid-msg"):$status_store.rfid_auth} 
					state={$claims_target_store.properties.state} />
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
		<div class="mt-1" class:is-hidden={!hidden_tiles}>
			<ExpandArrow bind:expand={$uistates_store.status_expanded} />
		</div>
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


