<script>
	import Borders from "./../../ui/Borders.svelte";
	import { _ } 		   from 'svelte-i18n'
	import { serialQueue } from "./../../../lib/queue.js";
	import SafetyTableRow  from "../../ui/SafetyTableRow.svelte";
	import {config_store}  from "../../../lib/stores/config.js"
	import {status_store}  from "../../../lib/stores/status.js"
	import { derived} 	   from "svelte/store"
	import Box 			   from "../../ui/Box.svelte"
	import SliderForm      from "../../ui/SliderForm.svelte"
	import Button          from "../../ui/Button.svelte"
	import {httpAPI}       from "../../../lib/utils.js"

	export let editable = true

	const rapiurl = "/r?json=1&rapi="
	let clear_counters_state = ""

	async function sendRapi(cmd) {
		return await httpAPI("GET", rapiurl + cmd)
	}

	async function clearCounters() {
		clear_counters_state = "loading"
		const res = await sendRapi("$FC")
		if (res && res != "error") {
			clear_counters_state = "ok"
		} else {
			clear_counters_state = "error"
		}
	}

	const areAllChecksActivated = derived(config_store, $config_store => {
		return (
		$config_store.gfci_check  &&
		$config_store.ground_check  &&
		$config_store.relay_check  &&
		$config_store.diode_check  &&
		$config_store.vent_check
		)
	})


</script>

<Box title={$_("config.titles.safety")} icon="mdi:shield-alert-outline" back={true}>
	{#if !$areAllChecksActivated}
	<div class="is-flex is-justify-content-center">
		<Borders>
		<span class="has-text-danger">
			{$_("warning")}!
		</span>
		<span>
			{$_("config.safety.warningmsg")}
		</span>

		</Borders>
	</div>
	{/if}

	<table class="table is-fullwidth">
		<thead>
			<tr class="has-background-info"	>
				<th class="has-text-white is-capitalized">{$_("config.safety.test")}</th>
				<th class="has-text-white has-text-centered is-capitalized">{$_("enabled")}</th>
			</tr>
		</thead>
		<tbody>
			<SafetyTableRow title={$_("config.safety.gfci-test")}    name="gfci_check" 	bind:checked={$config_store.gfci_check}   {editable} onChange={()=>serialQueue.add(()=> config_store.saveParam("gfci_check",  $config_store.gfci_check))} />
			<SafetyTableRow title={$_("config.safety.gnd-monitor")}  name="ground_check" bind:checked={$config_store.ground_check} {editable} onChange={()=>serialQueue.add(()=> config_store.saveParam("ground_check",$config_store.ground_check))} />
			<SafetyTableRow title={$_("config.safety.stuck-detect")} name="relay_check"	bind:checked={$config_store.relay_check}  {editable} onChange={()=>serialQueue.add(()=> config_store.saveParam("relay_check", $config_store.relay_check))} />
			<SafetyTableRow title={$_("config.safety.diode-check")}	 name="diode_check" 	bind:checked={$config_store.diode_check}  {editable} onChange={()=>serialQueue.add(()=> config_store.saveParam("diode_check", $config_store.diode_check ))} />
			<SafetyTableRow title={$_("config.safety.vent-check")}	 name="vent_check" 	bind:checked={$config_store.vent_check}   {editable} onChange={()=>serialQueue.add(()=> config_store.saveParam("vent_check",  $config_store.vent_check  ))} />
			<SafetyTableRow title={$_("config.safety.overcurrent-monitor")} name="overcurrent_monitor" bind:checked={$config_store.overcurrent_monitor} {editable} onChange={()=>serialQueue.add(()=> config_store.saveParam("overcurrent_monitor", $config_store.overcurrent_monitor))} />
		</tbody>
		<thead>
			<tr class="has-background-info">
				<th class="has-text-white">{$_("config.safety.errors")}</th>
				<th class="has-text-white has-text-centered">{$_("config.safety.count")}</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{$_("config.safety.gfci")}</td>
				<td class="has-text-centered"><span class="tag {$status_store.gfcicount==0?'is-primary':'is-danger'} is-primary ">{$status_store.gfcicount}</span></td>
			</tr>
			<tr>
				<td>{$_("config.safety.noground")}</td>
				<td class="has-text-centered"><span class="tag {$status_store.nogndcount==0?'is-primary':'is-danger'}">{$status_store.nogndcount}</span></td>
			</tr>
			<tr>
				<td>{$_("config.safety.stuck")}</td>
				<td class="has-text-centered"><span class="tag {$status_store.stuckcount==0?'is-primary':'is-danger'}">{$status_store.stuckcount}</span></td>
			</tr>
			<tr>
				<td colspan="2" class="has-text-centered pt-3 pb-3">
					<Button
						name={$_("config.safety.clear-counters")}
						color="is-danger is-outlined"
						state={clear_counters_state}
						butn_submit={clearCounters}
					/>
				</td>
			</tr>
		</tbody>
		<thead>
			<tr class="has-background-info">
				<th class="has-text-white" colspan="2">{$_("config.safety.temp-throttle-title")}</th>
			</tr>
		</thead>
		<tbody>
			<SafetyTableRow
				title={$_("config.safety.temp-throttle-enable")}
				name="temp_throttle_enabled"
				bind:checked={$config_store.temp_throttle_enabled}
				{editable}
				onChange={()=>serialQueue.add(()=> config_store.saveParam("temp_throttle_enabled", $config_store.temp_throttle_enabled))}
			/>
			{#if $config_store.temp_throttle_enabled}
			<tr>
				<td colspan="2" class="pt-3 pb-2">
					<SliderForm
						label={$_("config.safety.temp-throttle-setpoint")}
						bind:value={$config_store.temp_throttle_setpoint}
						min={40}
						max={80}
						step={1}
						unit={$_("units.C")}
						onchange={(val) => serialQueue.add(() => config_store.saveParam("temp_throttle_setpoint", val))}
					/>
					<div class="is-size-7 has-text-centered mt-1">{$_("config.safety.temp-throttle-desc")}</div>
				</td>
			</tr>
			{/if}
			<tr>
				<td colspan="2" class="pt-3 pb-2">
					<SliderForm
						label={$_("config.safety.over-temp-shutdown")}
						bind:value={$config_store.over_temp_shutdown}
						min={70}
						max={80}
						step={1}
						unit={$_("units.C")}
						onchange={(val) => serialQueue.add(() => config_store.saveParam("over_temp_shutdown", val))}
					/>
					<div class="is-size-7 has-text-centered mt-1">{$_("config.safety.over-temp-shutdown-desc")}</div>
				</td>
			</tr>
		</tbody>
	</Box>
