<script>
	import SelfProductionHelp from "./../../help/SelfProductionHelp.svelte";
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
	import AlertBox from "../../ui/AlertBox.svelte"
	import {faGear} from '@fortawesome/free-solid-svg-icons/index.js'
	
	let stg_submit_state
	let mode
	let modes = [{name: "Production", value: 0}, {name:"Excess Power", value: 1}]
	let alert_body
	let alert_visible = false

	async function toggleDivert() {	
		let res = await serialQueue.add(() => config_store.saveParam("divert_enabled", $config_store.divert_enabled))
	}

	let stg_submit = async () => {
		if (!$config_store.mqtt_solar && !$config_store.mqtt_grid_ie) {
			alert_body = "MQTT topic is missing"
			alert_visible=true
			return
		}
		else if (!$config_store.divert_PV_ratio) {
			alert_body = "Required PV power ratio is missing"
			alert_visible=true
			return
		}
		else if (!$config_store.divert_attack_smoothing_factor) {
			alert_body = "Divert smoothing attack is missing"
			alert_visible=true
			return
		}
		else if (!$config_store.divert_decay_smoothing_factor) {
			alert_body = "Divert smoothing decay is missing"
			alert_visible=true
			return
		}
		else if (!$config_store.divert_min_charge_time) {
			alert_body = "Minimum Charge Time is missing"
			alert_visible=true
			return
		}

		stg_submit_state = "loading"
	
		const data = {
			divert_attack_smoothing_factor: $config_store.divert_attack_smoothing_factor,
			divert_decay_smoothing_factor: $config_store.divert_decay_smoothing_factor,
			divert_min_charge_time: $config_store.divert_min_charge_time
				
		}
		if (mode == 0)
				data.mqtt_solar = $config_store.mqtt_solar
		else if (mode == 1) {
				data.mqtt_grid_ie = $config_store.mqtt_grid_ie
				data.divert_PV_ratio = $config_store.divert_PV_ratio
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

<style>
	.has-text-orange {
		color: orange;
	}
</style>
<Box title="Self Production" has_help={true} icon={faGear}>
	<div slot="help"><SelfProductionHelp  /> </div>
	<Switch name="divertswitch" label="Handle Self Production" onChange={toggleDivert} bind:checked={$config_store.divert_enabled} is_rtl={true}/>
	<div class="is-size-7">Dynamically adjust charge rate based on self production or excess power (grid export).</div>
	<div class="my-3">
		<span class="has-text-weight-bold is-size-7">Production:</span>
		<span class="is-size-7 has-text-primary has-text-weight-bold">{$status_store.solar}W</span>
		<span class="has-text-weight-bold  is-size-7">Last updated:</span>
		<span class="is-size-7 {$uistates_store.divert_update > 60?"has-text-danger":$uistates_store.divert_update <= 10?"has-text-primary":"has-text-orange"}">{s2mns($uistates_store.divert_update)}</span>
	</div>
	
	<Select title="Mode" bind:value={mode} items={modes} />
	{#if mode==0}
	<div><InputForm title="Feed:" bind:value={$config_store.mqtt_solar} placeholder="/topic/energy_production" /></div>
	<div class="is-size-7">Self Production MQTT topic (in W) to modulate charge rate based on production</div>
	{:else}
	<div><InputForm title="Feed:" bind:value={$config_store.mqtt_grid_ie} placeholder="/topic/grid" /></div>
	
	<div class="is-size-7">Grid (+I/-E) MQTT topic to modulate charge rate based on excess power</div>
	{/if}

	{#if mode==1}
	<div><InputForm title="Required PV power ratio:" type="number" bind:value={$config_store.divert_PV_ratio} placeholder="1.1" /></div>
	<div class="is-size-7">The fraction of PV current that suffices to start charging or increment current</div>
	{/if}
	<div><InputForm title="Divert smoothing attack:" type="number" bind:value={$config_store.divert_attack_smoothing_factor} placeholder="0.4" /></div>
	<div class="is-size-7">The amount of the new feed value to add to the divert available power rolling average</div>
	<div><InputForm title="Divert smoothing decay:" type="number" bind:value={$config_store.divert_decay_smoothing_factor} placeholder="0.005" /></div>

	<div class="is-size-7">The amount of the new feed value to remove to the divert available power rolling average</div>
	<div><InputForm title="Minimum Charge Time:" type="number" bind:value={$config_store.divert_min_charge_time} placeholder="600" /></div>
	<div class="is-size-7">The minimum amount of time (seconds) to charge the car once enabled via the self production divert. This can help minimise wear and tear on the EVSE.</div>
	<div class="block mt-5">
		<Button name="Save" color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
	</div>
	<AlertBox body={alert_body} bind:visible={alert_visible} />
</Box>