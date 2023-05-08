<script>
	import { uistates_store } 		from "./../../../lib/stores/uistates.js";
	import Expandable 				from "./../../ui/Expandable.svelte";
	import { config_store } 		from "../../../lib/stores/config.js";
	import { _ } 					from 'svelte-i18n'
	import {status_store} 			from "../../../lib/stores/status.js"
	import { derived} 				from "svelte/store"
	import {round, s2mns}			from "../../../lib/utils.js"
	import {sec2time, displayRange} from "../../../lib/utils.js"

	let evelapsed = derived(uistates_store, store => s2mns(store.vehicle_state_update))

	$: data_emeter = {
		title: $_("monitoring-energy-delivered"),
		items: [
			{name: $_("session"), value: round($status_store.session_energy/1000,1), unit: $_("units.kwh")},
			{name: $_("total"), value: round($status_store.total_energy,1), unit: $_("units.kwh")},
			{name: $_("monitoring-total-day"), value: round($status_store.total_day,1), unit: $_("units.kwh")},
			{name: $_("monitoring-total-week"), value: round($status_store.total_week,1), unit: $_("units.kwh")},
			{name: $_("monitoring-total-month"), value: round($status_store.total_month,1), unit: $_("units.kwh")},
			{name: $_("monitoring-total-year"), value: round($status_store.total_year,1), unit: $_("units.kwh")}
		]
	}

	$: data_sensors = {
		title: $_("monitoring-tab-sensors"),
		items: [
			{name: $_("monitoring-sensors-pilot"), value: $status_store.pilot, unit: $_("units.A")},
			{name: $_("monitoring-sensors-current"), value: $status_store.amp/1000, unit: $_("units.A")},
			{name: $_("monitoring-sensors-voltage"), value: $status_store.voltage, unit: $_("units.V")},
			{name: $_("monitoring-sensors-evsetemp"), value: round($status_store.temp/10,1), unit: $_("units.C")},
			{name: "temp1", value: !$status_store.temp1.isNaN?round($status_store.temp1/10,1):"", unit: $_("units.C")},
			{name: "temp2", value: !$status_store.temp2.isNaN?round($status_store.temp2/10,1):"", unit: $_("units.C")},
			{name: "temp3", value: !$status_store.temp3.isNaN?round($status_store.temp3/10,1):"", unit: $_("units.C")},
			{name: "temp4", value: !$status_store.temp3.isNaN?round($status_store.temp4/10,1):"", unit: $_("units.C")},
			{name: $_("monitoring-sensors-sensorscale"), value: $config_store.scale},
			{name: $_("monitoring-sensors-sensoroffset"), value: $config_store.offset}
		]
	}

	$: data_service = {
		title: $_("monitoring-service"),
		items: [
			{name: $_("monitoring-service-level"), value: $status_store.service_level, unit: ""},
			{name: $_("monitoring-service-servicemin"), value: $config_store.min_current_hard, unit: $_("units.A")},
			{name: $_("monitoring-service-servicemax"), value: $config_store.max_current_soft, unit: $_("units.A")}
		]
	}

	$: data_vehicle = {
		title: $_("config.vehicle.vehicle"),
		items: [
			{name: $_("config.vehicle.lastupdated"), value: $evelapsed, unit: ""},
			{name: $_("config.vehicle.battery"), value: $status_store.battery_level, unit: "%"},
			{name: $_("config.vehicle.range"), value: displayRange($status_store.battery_range), unit: $config_store.mqtt_vehicle_range_miles?$_("units.miles"):$_("units.km")},
			{name: $_("config.vehicle.timeleft"), value: sec2time($status_store.time_to_full_charge), unit: ""}
		]
	}

	const expanded = 
	{
		emeter: true,
		sensors: false,
		vehicle: false,
		service: false
	}

	function handleMessage(event) {
		if (event.detail.text == "closeAll") {
			Object.keys(expanded).forEach(function(key) {
				expanded[key] = false
			});
		}
	}


</script>

<div>

	<Expandable data={data_emeter}  bind:expanded={expanded.emeter}  on:message={handleMessage}/>
	<Expandable data={data_sensors} bind:expanded={expanded.sensors} on:message={handleMessage} />
	{#if $status_store.battery_level != undefined || $status_store.battery_range != undefined  || $config_store.time_to_full_charge}
	<Expandable data={data_vehicle} bind:expanded={expanded.vehicle} on:message={handleMessage} />
	{/if}
	<Expandable data={data_service} bind:expanded={expanded.service} on:message={handleMessage} />
</div>