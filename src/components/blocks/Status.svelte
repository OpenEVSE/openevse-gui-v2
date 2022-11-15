<script>
	import { claims_target_store } from "./../../lib/stores/claims_target.js";
	import {EvseClients} from "./../../lib/vars.js"
	import SchedulePlan from "./../ui/SchedulePlan.svelte";
	import {status_store} from "../../lib/stores/status.js"
	import {plan_store} from "../../lib/stores/plan.js"
	import {config_store} from "../../lib/stores/config.js"
	import {uistates_store} from "../../lib/stores/uistates.js"
	import StatusTile from "../ui/StatusTile.svelte"
	import StatusItems from "../ui/StatusItems.svelte"
	import ExpandArrow from "../ui/ExpandArrow.svelte"
	import {formatDate} from "../../lib/utils.js"
	
	let time
	let elapsed

	$: { 
		if ($status_store.elapsed != undefined)
			elapsed = new Date($status_store.elapsed * 1000).toISOString().slice(11, 16) 
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
	.statusbox.charging {
		box-shadow: 0 0.5em 1em -0.125em rgba(18, 221, 225, 0.741), 0 0px 0 1px rgba(0,0,0, 0.02);
	}

</style>
{#if $status_store.evse_connected == 1}
<div class="statusbox {$status_store.status == "disabled" ? "disabled":$status_store.state==3?"charging":"active"} p-3 has-background-light mb-3 mt-0 px-3">
	<div class="mb-2 mx-0">
		<StatusItems state={$status_store.state} vehicle={$status_store.vehicle} time={$uistates_store.time_localestring} bp={$uistates_store.breakpoint} />
	</div>

	<div class="mx-0 is-flex is-align-content-space-between is-justify-content-center">
		<StatusTile title="Elapsed" value={elapsed} />
		<StatusTile title="Delivered" value={$status_store.session_energy/1000} precision={1} unit="kWh" />
		<StatusTile title="Current" value={$status_store.amp/1000} precision={1} unit="A" />
		{#if $uistates_store.breakpoint != "mobile"}
		<!-- // Desktop & Tablet only -->
		<StatusTile title="Power" value={($status_store.amp/1000) * $status_store.voltage} unit="W" />
		{/if}
		{#if $uistates_store.breakpoint == "desktop"}
		<!-- // Desktop only -->
		<StatusTile title="Setpoint" value={$status_store.pilot} unit="A" />
		{/if}
	</div>

	{#if $uistates_store.status_expanded}
	<div class="mx-0 is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-center" >
		{#if $uistates_store.breakpoint == "mobile"}
		<!-- // Mobile only -->
		<StatusTile title="Power" value={($status_store.amp/1000) * $status_store.voltage} unit="W" />
		{/if}
		{#if $uistates_store.breakpoint != "desktop"}
		<!-- // Tablet & Mobile only -->
		<StatusTile title="Setpoint" value={$status_store.pilot} unit="A" />
		{/if}
		{#if $status_store.divertmode == 2}
		<StatusTile title="Available" value={$status_store.charge_rate!=undefined?$status_store.charge_rate:0} unit="A" />
		{:else if $status_store.shaper == 1}
		<StatusTile title="Available" value={$status_store.shaper_chg_cur} unit="A" />

		{/if}
		<!-- <StatusTile title="Total" value={$status_store.total_energy} precision={1} unit="kWh" />
		<StatusTile title="Voltage" value={$status_store.voltage} unit="V" />	 -->
		{#if $status_store.battery_level}
		<StatusTile title="EV SOC" value={$status_store.battery_level} unit="%" />
		<StatusTile title="EV Range" value={$status_store.battery_range} unit="km" />
		{/if}
	</div>
	{/if}
			<div class="is-flex mt-3 mt-4 mb-1 ml-4 ">
				<div class="columns">

				{#if ($uistates_store.mode != 0) }
				<SchedulePlan mode="manual" state={$status_store.status} />
				{:else}
					{#if $uistates_store.stateclaimfrom != "timer"}
					<SchedulePlan mode={$uistates_store.stateclaimfrom} state={$claims_target_store.properties.state} />
					{:else}
					<SchedulePlan mode="timer" msg={$plan_store.current_event.state=="active"?"Activated since":"Disabled since"} state={$plan_store.current_event.state} time={$plan_store.current_event.time} />
					<SchedulePlan mode="timer" msg={$plan_store.next_event.state=="active"?"Activate at":"Disable at"} state={$plan_store.next_event.state} time={$plan_store.next_event.time} />
					{/if}
					
				
				{/if}
				</div>
			</div>
	<div class="mt-1"><ExpandArrow bind:expand={$uistates_store.status_expanded} /></div>
</div>
{:else}
<div class="statusbox disabled has-background-light mb-5 mt-0 px-3">
	<h4 class="title">EVSE Error</h4>
	<span>OpenEVSE not responding or not connected</span>
</div>
{/if}
