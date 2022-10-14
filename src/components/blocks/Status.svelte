<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import { faAngleDown, faAngleUp, faAngleRight } from '@fortawesome/free-solid-svg-icons/index.js'
	import {status_store} from "../../lib/stores/status.js"
	import {plan_store} from "../../lib/stores/plan.js"
	import {config_store} from "../../lib/stores/config.js"
	import {states_store} from "../../lib/stores/states.js"

	// @ts-ignore
	import WebSocket from "../data/WebSocket.svelte"
	let time
	let tz
	let elapsed
	let expand = false
	let size = "sm"

	$: elapsed = new Date($status_store.elapsed * 1000).toISOString().slice(11, 19);
	$: time = utc2evseLocalTime($status_store.time, $config_store.time_zone)
	$: console.log(time)
	
	function utc2evseLocalTime(t,s) {
		let date = new Date(t)
		let lt = date.toLocaleString(navigator.language, { timeZone: getTZ(s) })
		return lt
	}
	function getTZ(s) { 
    	let tz = s.split('|')[0]
		return tz
	}

	
</script>

<style>
	.break{
		word-break: break-all;
	}

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
	.tiles {
		max-width : 200px;
		margin: auto;
	}
	
</style>


<WebSocket/>
<div class="statusbox {$status_store.status == "disabled" ? "disabled":"active"} has-background-light">
	<div class="level is-mobile">
		<div class="level-left p-0 m-0">
			<div class="level-item pl-0 pt-0 pb-2 is-narrow is-size-6 has-text-weight-semibold notification">Status&nbsp;
				<span class="tag is-capitalized {$status_store.status == 'active'?'is-primary':'is-danger'}">{$status_store.status}</span>
			</div>
		</div>
		<div class="level-right px-0 mx-0">
			<div class="level-item break m-0 p-0 is-size-6 has-text-weight-semibold has-text-danger notification">Waiting - EV Not connected</div>
		</div>	
		
	</div>

	<div class="level is-mobile">
		<div class="box level-item has-text-centered py-1 px-2 tiles">
			<div>
				<p class="heading has-text-weight-semibold">Current</p>
				<p class="is-size-5 has-text-weight-semibold">{$status_store.amp} A</p>
			</div>
		</div>
		<div class="box level-item has-text-centered py-1 px-2 tiles">
			<div>
				<p class="heading has-text-weight-semibold">Energy</p>
				<p class="is-size-5 has-text-weight-semibold">{($status_store.session_energy/1000).toFixed(1)} kW/h</p>
			</div>
		</div>
		<div class="box level-item has-text-centered py-1 px-2 tiles">
			<div>
				<p class="heading has-text-weight-semibold">Temp°</p>
				<p class="is-size-5 has-text-weight-semibold">{$status_store.temp/10} °C</p>
			</div>
		</div>
		<div class="box level-item has-text-centered py-1 px-2 tiles">
			<div>
				<p class="heading has-text-weight-semibold">Elapsed</p>
				<p class="is-size-5 has-text-weight-semibold">{elapsed}</p>
			</div>
		</div>
	</div>

	{#if expand}
	<div class="level is-mobile">
		<div class="box level-item has-text-centered tiles py-1 px-2 tiles">
			<div>
				<p class="heading has-text-weight-semibold">Pilot</p>
				<p class="is-size-5 has-text-weight-semibold">{$status_store.pilot} A</p>
			</div>
		</div>
		<div class="box level-item has-text-centered py-1 px-2 tiles">
			<div>
				<p class="heading has-text-weight-semibold">Voltage</p>
				<p class="is-size-5 has-text-weight-semibold">{$status_store.voltage} V</p>
			</div>
		</div>
		<div class="box level-item has-text-centered py-1 px-2 tiles">
			<div>
				<p class="heading has-text-weight-semibold">Total</p>
				<p class="is-size-5 has-text-weight-semibold">{$status_store.total_energy.toFixed(1)} kW/h</p>
			</div>
		</div>
		{#if $status_store.battery_level}
		<div class="box level-item has-text-centered py-1 px-2 tiles">
			<div>
				<p class="heading has-text-weight-semibold">SOC</p>
				<p class="is-size-5 has-text-weight-semibold">{$status_store.battery_level} %</p>
			</div>
		</div>
		{/if}
	</div>
	{/if}

	<div class="container">
		<div class="columns is-flex-direction-row is-size-6 pt-2">
			<div class="px-2"><span class="has-text-weight-bold is-size-7 is-align-content-flex-start">Current Event: </span> <span class="tag is-white has-text-danger is-capitalized">{$plan_store.current_event.state} {$plan_store.current_event.time}</span></div>
			<div class="px-2"><span class="has-text-weight-bold is-size-7 is-align-content-flex-end">Next Event: </span> <span class="tag is-white has-text-primary is-capitalized">{$plan_store.next_event.state} {$plan_store.next_event.time}</span></div>
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
