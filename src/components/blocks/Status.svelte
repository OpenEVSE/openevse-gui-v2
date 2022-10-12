<script>
	import {status_store} from "../../lib/stores/status.js"
	import {plan_store} from "../../lib/stores/plan.js"
	import WebSocket from "../data/WebSocket.svelte"

	$: elapsed = new Date($status_store.elapsed * 1000).toISOString().slice(11, 19);

</script>

<WebSocket/>
<div class="box has-background-light">
	<div class="is-flex-direction-row">
		<div class="px-0 pt-0 pb-2 is-narrow is-size-6 has-text-weight-semibold notification">Status&nbsp;
			<span class="tag is-capitalized {$status_store.status == 'active'?'is-primary':'is-danger'}">{$status_store.status}</span>
			<div class="p-0 m-0 is-size-6 has-text-weight-semibold has-text-danger notification is-align-content-flex-end">Waiting - EV Not connected</div>
		</div>
	</div>

	<div class="level is-mobile">
		<div class="box level-item has-text-centered p-1 tiles">
			<div>
				<p class="heading has-text-weight-semibold">Current</p>
				<p class="is-size-5 has-text-weight-semibold">{$status_store.amp}A</p>
			</div>
		</div>
		<div class="box level-item has-text-centered p-1">
			<div>
				<p class="heading has-text-weight-semibold">Energy</p>
				<p class="is-size-5 has-text-weight-semibold">{($status_store.session_energy/1000).toFixed(1)}kWh</p>
			</div>
		</div>
		<div class="box level-item has-text-centered p-1">
			<div>
				<p class="heading has-text-weight-semibold">Temp°</p>
				<p class="is-size-5 has-text-weight-semibold">{$status_store.temp/10}°C</p>
			</div>
		</div>
		<div class="box level-item has-text-centered p-1">
			<div>
				<p class="heading has-text-weight-semibold">Elapsed</p>
				<p class="is-size-5 has-text-weight-semibold">{elapsed}</p>
			</div>
		</div>
	</div>

	<div class="container">
		<div class="columns is-flex-direction-row is-size-6 pt-2">
			<div class="px-2"><span class="has-text-weight-bold is-size-7 is-align-content-flex-start">Current Event: </span> <span class="tag is-white has-text-danger is-capitalized">{$plan_store.current_event.state} {$plan_store.current_event.time}</span></div>
			<div class="px-2"><span class="has-text-weight-bold is-size-7 is-align-content-flex-end">Next Event: </span> <span class="tag is-white has-text-primary is-capitalized">{$plan_store.next_event.state} {$plan_store.next_event.time}</span></div>
		</div>
	</div>

</div>
