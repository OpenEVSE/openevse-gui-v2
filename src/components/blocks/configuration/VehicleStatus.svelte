<script>
	import { _ } 		  			   from 'svelte-i18n'
	import { config_store }			   from "./../../../lib/stores/config.js";
	import { uistates_store } 		   from "./../../../lib/stores/uistates.js";
	import {status_store} 			   from "../../../lib/stores/status.js"
	import {sec2time, s2mns, miles2km} from "../../../lib/utils.js"

	$: updated = s2mns($uistates_store.vehicle_update)
</script>
<style>
	.tags {
		box-sizing: border-box;
		width: 100%;
	}
	.has-text-orange {
		color: orange;
	}
</style>
<div class="">
	<div class="my-3" class:is-hidden={!$uistates_store.vehicle_update || $uistates_store.vehicle_update < 1}>
		<span class="has-text-weight-bold  is-size-7">{$_("config.vehicle.lastupdated")}:</span>
		<span class="is-size-7 {$uistates_store.vehicle_update > 3600?"has-text-danger":$uistates_store.vehicle_update < 300?"has-text-primary":"has-text-orange"} ">{updated}</span>
	</div>
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
			{#if $status_store.battery_level != undefined}
			<tr>
				<td>{$_("config.vehicle.battery")}</td>
				<td class="has-text-right">
					<div class="tag tags is-info is-flex is-flex-direction-row is-align-items-center is-justify-content-center">
						<div class="is-flex-stretch-1 is-flex-grow-1 mr-2 is-hidden-mobile ">
							<progress class="progress {$status_store.battery_level < 20 ? "is-danger":$status_store.battery_level < 60 ?"is-warning":"is-primary"}" value={$status_store.battery_level} max="100">{$status_store.battery_level}</progress>
						</div>
						<div class="is-info is-size-7 has-text-weight-bold">{$status_store.battery_level}%</div>
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