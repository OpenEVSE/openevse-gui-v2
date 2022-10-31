<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import { faCircleCheck, faCircleXmark} from '@fortawesome/free-solid-svg-icons/index.js'
	import {config_store} from "../../lib/stores/config.js"
	import {status_store} from "../../lib/stores/status.js"
</script>
<style>
	/* .box {
			max-width : 310px;
			min-width: 300px;
		} */
</style>
<div class="box m-4 is-flex-grow-2 is-flex-shrink-0 ">
	<div class="has-text-weight-bold is-size-5 mb-3">Safety</div>
	<table class="table is-fullwidth">
		<thead>
			<tr class="has-background-info"	>
				<th class="has-text-white">Test</th>
				<th class="has-text-white">Status</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>GFCI Self Test</td>
				<td><Fa class="is-size-5 {$config_store.gfci_check?"has-text-primary":"has-text-danger"}" icon={$config_store.gfci_check?faCircleCheck:faCircleXmark} /></td>
			</tr>
			<tr>
				<td>Ground Monitoring</td>
				<td><Fa class="is-size-5 {$config_store.ground_check?"has-text-primary":"has-text-danger"}" icon={$config_store.ground_check?faCircleCheck:faCircleXmark} /></td>
			</tr>
			<tr>
				<td>Stuck Contact Detection</td>
				<td><Fa class="is-size-5 {$config_store.relay_check?"has-text-primary":"has-text-danger"}" icon={$config_store.relay_check?faCircleCheck:faCircleXmark} /></td>
			</tr>
			<tr>
				<td>Temperature Monitoring</td>
				<td><Fa class="is-size-5 {$config_store.temp_check?"has-text-primary":"has-text-danger"}" icon={$config_store.temp_check?faCircleCheck:faCircleXmark} /></td>
			</tr>
			<tr>
				<td>Diode Check</td>
				<td><Fa class="is-size-5 {$config_store.diode_check?"has-text-primary":"has-text-danger"}" icon={$config_store.diode_check?faCircleCheck:faCircleXmark} /></td>
			</tr>
			<tr>
				<td>Vent Required</td>
				<td><Fa class="is-size-5 {$config_store.vent_check?"has-text-primary":"has-text-danger"}" icon={$config_store.vent_check?faCircleCheck:faCircleXmark} /></td>
			</tr>
		</tbody>
		<thead>
			<tr class="has-background-info">
				<th class="has-text-white">Error</th>
				<th class="has-text-white">Count</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>GFCI</td>
				<td><span class="tag {$status_store.gfcicount==0?'is-primary':'is-danger'} is-primary">{$status_store.gfcicount}</span></td>
			</tr>
			<tr>
				<td>No Ground</td>
				<td><span class="tag {$status_store.nogndcount==0?'is-primary':'is-danger'}">{$status_store.nogndcount}</span></td>
			</tr>
			<tr>
				<td>Stuck Contact</td>
				<td><span class="tag {$status_store.stuckcount==0?'is-primary':'is-danger'}">{$status_store.stuckcount}</span></td>
			</tr>
		</tbody>
</div>