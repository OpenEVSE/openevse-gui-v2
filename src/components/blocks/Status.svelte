<script>
	import { _ } 					from 'svelte-i18n'
	import {status_store} 			from "../../lib/stores/status.js"
	import {plan_store} 			from "../../lib/stores/plan.js"
	import {uistates_store} 		from "../../lib/stores/uistates.js"
	import {sec2time} 				from "../../lib/utils.js"
	import { scale } 				from 'svelte/transition';
	import { expoInOut } 			from 'svelte/easing';
	import { claims_target_store }  from "./../../lib/stores/claims_target.js";
	import DivertShaperStatus 		from "./../ui/DivertShaperStatus.svelte";
	import TaskDisplay 				from "../ui/TaskDisplay.svelte";
	import StatusTile 				from "../ui/StatusTile.svelte"
	import StatusItems 				from "../ui/StatusItems.svelte"
	import ExpandArrow 				from "../ui/ExpandArrow.svelte"

	let elapsed
	$uistates_store.status_expanded
	$: { 
		if ($status_store && $status_store.elapsed != undefined)
		    elapsed = sec2time($status_store.elapsed)
		}
	
</script>

<style type="text/scss">
	.statusbox {
		// width: 100%;
		border-radius: 6px;
		color: black;
		background-color: hsl(0, 0%, 96%);
		// display: block;
		// margin-bottom: 3rem;
		// transition:all 3s ease-in-out;
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

{#if $status_store.evse_connected == 1 && $uistates_store.data_loaded}
<div class="container statusbox {$status_store.status == "disabled" ? "disabled":$status_store.state==3?"charging":"active"} has-background-color-light px-1 pt-2 pb-1 has-background-light" 
in:scale="{{ delay: 0, duration: 300, easing: expoInOut }}" >
	<div>
		<div class="mb-2 mx-0">
			<StatusItems state={$status_store.state} vehicle={$status_store.vehicle} time={$uistates_store.time_localestring} bp={$uistates_store.breakpoint} />
		</div>

		<div class="mx-0 is-flex is-align-content-space-between is-justify-content-center">
			<StatusTile title={$_("status-tile-elapsed")} value={elapsed} />
			<StatusTile title={$_("status-tile-delivered")} value={$status_store.session_energy/1000} precision={1} unit="kwh" />
			<StatusTile title={$_("status-tile-current")} value={$status_store.amp/1000} precision={1} unit="A" />
			{#if $uistates_store.breakpoint != "mobile" && $uistates_store.breakpoint != "mobilemini"}
			<!-- // Desktop & Tablet only -->
			<StatusTile title={$_("status-tile-power")} value={($status_store.amp/1000) * $status_store.voltage} unit="W" />
			{/if}
			{#if $uistates_store.breakpoint == "desktop"}
			<!-- // Desktop only -->
			<StatusTile title={$_("status-tile-setpoint")} value={$status_store.pilot} unit="A" />
			{/if}
		</div>

		{#if $uistates_store.status_expanded}
		<div class="mx-0 is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-center">
			{#if $uistates_store.breakpoint == "mobile" || $uistates_store.breakpoint == "mobilemini"}
			<!-- // Mobile only -->
			<StatusTile title={$_("status-tile-power")} value={($status_store.amp/1000) * $status_store.voltage} unit="W" />
			{/if}
			{#if $uistates_store.breakpoint != "desktop"}
			<!-- // Tablet & Mobile only -->
			<StatusTile title={$_("status-tile-setpoint")} value={$status_store.pilot} unit="A" />
			{/if}
			{#if $status_store.divertmode == 2}
			<StatusTile title={$_("status-tile-available")} value={$status_store.charge_rate} unit="A" />
			{:else if $status_store.shaper == 1}
			<StatusTile title={$_("status-tile-available")} value={$status_store.shaper_cur} unit="A" />
			{/if}
			{#if $status_store.battery_level != undefined}
			<StatusTile title={$_("status-tile-battery")} value={$status_store.battery_level} unit="%" />
			{/if}
			{#if $status_store.battery_range != undefined}
			<StatusTile title={$_("status-tile-range")} value={$status_store.battery_range} unit="km" />
			{/if}
			{#if $status_store.time_to_full_charge}
			<StatusTile title={$_("status-tile-remaining")} value={sec2time($status_store.time_to_full_charge)} />
			{/if}

		</div>
		{/if}
				<div class="is-flex mt-3 mt-4 mb-1 ml-4 ">
					<div class="columns">
						{#if $uistates_store.stateclaimfrom == "manual" || !$claims_target_store.claims.state}
						<TaskDisplay mode={$_("clients.manual")} state={$status_store.status} />
						{:else if $uistates_store.stateclaimfrom == "rfid"}
						<TaskDisplay mode={$_("clients." + $uistates_store.stateclaimfrom )}  msg={!$status_store.rfid_auth?$_("status-task-rfid-msg"):$status_store.rfid_auth} state={$claims_target_store.properties.state} />
						{:else if $uistates_store.stateclaimfrom != "timer"}
						<TaskDisplay mode={$_("clients." + $uistates_store.stateclaimfrom)} state={$claims_target_store.properties.state == "active"?$_("active"):$_("disabled")} />
						{:else if $uistates_store.stateclaimfrom == "timer"}
						<TaskDisplay mode={$_("clients.timer")} msg={$plan_store.current_event.state=="active"?$_("status-task-timer-activated"):$_("status-task-timer-disabled")} state={$plan_store.current_event.state} time={$plan_store.current_event.time} />
						{#if $plan_store.current_event.state != $plan_store.next_event.state}
						<TaskDisplay mode="timer" msg={$plan_store.next_event.state=="active"?$_("status-task-timer-activate"):$_("status-task-timer-disable")} state={$plan_store.next_event.state} time={$plan_store.next_event.time} />
						{/if}
					{/if}
					</div>
				</div>
				<DivertShaperStatus />
		<div class="mt-1"><ExpandArrow bind:expand={$uistates_store.status_expanded} /></div>
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



