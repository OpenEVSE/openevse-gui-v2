<script>
	import Select from "./../../ui/Select.svelte";
	import { uistates_store } from "./../../../lib/stores/uistates.js";
	import { status_store } from "./../../../lib/stores/status.js";
	import InputForm from "./../../ui/InputForm.svelte";
	import Box from "../../ui/Box.svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import Button from "./../../ui/Button.svelte";
	import { serialQueue } from "./../../../lib/queue.js";
	import Switch from "./../../ui/Switch.svelte";
	import {s2mns} from "../../../lib/utils.js"
	let stg_submit_state
	let mode
	let modes = [{name: "Production", value: 0}, {name:"Excess Power", value: 1}]

	async function toggleDivert() {	
		let res = await serialQueue.add(() => config_store.saveParam("divert_enabled", $config_store.divert_enabled))
	}

	let stg_submit = async () => {
		stg_submit_state = "loading"
	
		const data = {

				}

		if (await config_store.upload(data)) 
			{
				stg_submit_state = "ok"
				return true
			}
		else {
			stg_submit_state = "error"
			return false
		}
	
	}

	function setMode(grid = "") {
		if (grid) {
			mode = 1
		}
		else {
			mode = 0
		}
	}

	$: setMode($config_store.mqtt_grid_ie)

</script>

<Box title="Self Production">
	<Switch name="divertswitch" label="Handle Self Production" onChange={toggleDivert} bind:checked={$config_store.divert_enabled} is_rtl={true}/>
	<div class="is-size-7">Dynamically adjust charge rate based on self production or excess power (grid export).</div>
	<div class="my-3">
		<span class="has-text-weight-bold is-size-7">Production:</span>
		<span class="is-size-7 has-text-primary has-text-weight-bold">{$status_store.solar}W</span>
		<span class="has-text-weight-bold  is-size-7">Last updated:</span>
		<span class="is-size-7 has-text-danger">{s2mns($uistates_store.divert_update)}</span>
	</div>
	
	<Select title="Mode" bind:value={mode} items={modes} />
	{#if mode==0}
	<InputForm title="Feed:" bind:value={$config_store.mqtt_solar} placeholder="/topic/energy_production" />
	<div class="is-size-7">Self Production MQTT topic (in W) to modulate charge rate based on production</div>
	{:else}
	<InputForm title="Feed:" bind:value={$config_store.mqtt_grid_ie} placeholder="/topic/grid" />
	<div class="is-size-7">Grid (+I/-E) MQTT topic to modulate charge rate based on excess power</div>
	{/if}

	{#if mode==1}
	<InputForm title="Required PV power ratio:" bind:value={$config_store.divert_PV_ratio} placeholder="1.1" />
	<div class="is-size-7">The fraction of PV current that suffices to start charging or increment current</div>
	{/if}

	<InputForm title="Divert smoothing attack:" bind:value={$config_store.divert_attack_smoothing_factor} placeholder="0.4" />
	<div class="is-size-7">The amount of the new feed value to add to the divert available power rolling average</div>
	<InputForm title="Divert smoothing decay:" bind:value={$config_store.divert_decay_smoothing_factor} placeholder="0.005" />
	<div class="is-size-7">The amount of the new feed value to remove to the divert available power rolling average</div>
	<InputForm title="Minimum Charge Time:" bind:value={$config_store.divert_min_charge_time} placeholder="600" />
	<div class="is-size-7">The minimum amount of time (seconds) to charge the car once enabled via the self production divert. This can help minimise wear and tear on the EVSE.</div>

	<div class="block mt-5">
		<Button name="Save" color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
	</div>
</Box>