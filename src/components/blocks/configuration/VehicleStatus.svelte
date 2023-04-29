<script>
	import { uistates_store } from "./../../../lib/stores/uistates.js";
	import { onMount } from "svelte";
	import { _ } 		  			   from 'svelte-i18n'
	import { config_store }			   from "./../../../lib/stores/config.js"
	import {status_store} 			   from "../../../lib/stores/status.js"
	import { derived} 				   from "svelte/store"
	import {sec2time, s2mns, miles2km} from "../../../lib/utils.js"

	let evelapsed = derived(uistates_store, store => s2mns(store.vehicle_state_update))
	let mode
	function getMode() {
		if ($config_store.tesla_enabled)
			mode = 1
		else if ($config_store.mqtt_vehicle_soc)
			mode = 2
		else mode = 0
	}
	onMount(()=>getMode())
</script>
<style>
	.tags {
		box-sizing: border-box;
		width: 100%;
	}
</style>
<div class="columns is-centered">
	<div class="column is-three-quarters is-full-mobile">
		<div class="is-flex is-flex-direction-column is-justify-content-center">
			<table class="table is-fullwidth ">
				<thead>
					<tr class="has-background-info"	>
						<th class="has-text-white">{$status_store.tesla_vehicle_name?$status_store.tesla_vehicle_name:$_("config.vehicle.vehicle")}</th>
						<th class="has-text-white has-text-centered" style="width:40%">{$status_store.tesla_vehicle_id?$status_store.tesla_vehicle_id:""}</th>
					</tr>
				</thead>
				{#if $config_store.tesla_enabled && $status_store.tesla_error}
				<tbody>
					<tr>
						<td>{$_("error")}: {$status_store.tesla_error}</td>
						<td></td>
					</tr>
				</tbody>
				{:else}
				<tbody>
					<tr>
						<td>
							{$_("config.vehicle.lastupdated")}
						</td>
						<td>
							<div class="tag tags {$status_store.vehicle_state_update > 3600 && $uistates_store.charging?"is-danger":$status_store.vehicle_state_update < 300 && $uistates_store.charging?"is-primary":$uistates_store.charging?"is-warning":"is-info"} ">{$evelapsed}</div>
						</td>
					</tr>
					
					{#if $status_store.battery_level != undefined}
					<tr>
						<td>{$_("config.vehicle.battery")}</td>
						<td class="has-text-right">
							<div class="tag tags is-info">
								<div class="is-size-7">{$status_store.battery_level}%</div>
							</div>
						</td>
					</tr>
					{/if}
					{#if $status_store.battery_range != undefined}
					<tr>
						<td>{$_("config.vehicle.range")}</td>
						<td class="has-text-right"><span class="tag tags is-info">
							{#if !$config_store.tesla_enabled || $config_store.tesla_enabled && $config_store.mqtt_vehicle_range_miles}
								{$status_store.battery_range}
							{:else if !$config_store.mqtt_vehicle_range_miles}
								{miles2km($status_store.battery_range)}
							{/if}
							{#if $config_store.mqtt_vehicle_range_miles}
							{$_("units.miles")}
							{:else}
							{$_("units.km")}
							{/if}
						</span></td>
					</tr>
					{/if}
					{#if $status_store.time_to_full_charge != undefined}
					<tr>
						<td>{$_("config.vehicle.timeleft")}</td>
						<td class="has-text-right"><span class="tag tags is-info">{sec2time($status_store.time_to_full_charge)}</span></td>
					</tr>
					{/if}
				</tbody>
				{/if}
			</table>
		</div>
	</div>
</div>