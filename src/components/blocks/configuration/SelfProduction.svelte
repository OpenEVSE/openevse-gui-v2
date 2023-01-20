<script>
	import { _ } 			  from 'svelte-i18n'
	import { uistates_store } from "./../../../lib/stores/uistates.js";
	import { derived }		  from "svelte/store"
	import { status_store }   from "./../../../lib/stores/status.js";
	import { config_store }   from "./../../../lib/stores/config.js";
	import { serialQueue }    from "./../../../lib/queue.js";
	import {s2mns, round} 	  from "../../../lib/utils.js"
	import SelfProductionHelp from "./../../help/SelfProductionHelp.svelte";
	import Select 			  from "./../../ui/Select.svelte";
	import InputForm 		  from "./../../ui/InputForm.svelte";
	import Box 				  from "../../ui/Box.svelte";
	import Button 			  from "./../../ui/Button.svelte";
	import Switch 			  from "./../../ui/Switch.svelte";
	import AlertBox 		  from "../../ui/AlertBox.svelte"
	
	let stg_submit_state
	let modes = [{name: $_("config.selfprod.production"), value: 0}, {name:$_("config.selfprod.excess"), value: 1}]
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
		if ($uistates_store.divert_type == 0) {
				data.mqtt_solar = $config_store.mqtt_solar
				data.mqtt_grid_ie = ""
		}
				
		else if ($uistates_store.divert_type == 1) {
				data.mqtt_grid_ie = $config_store.mqtt_grid_ie
				data.mqtt_solar = ""
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

	let divertelapsed = derived(status_store, store => s2mns(store.divert_update))

</script>

<style>
	.has-text-orange {
		color: orange;
	}
</style>
<Box title={$_("config.titles.selfprod")} has_help={true} icon="fa6-solid:solar-panel" back={true}>
	<div slot="help"><SelfProductionHelp  /> </div>
	<div class="pb-1 my-3" >
		<Switch name="divertswitch" label={$_("config.selfprod.enable")} onChange={toggleDivert} bind:checked={$config_store.divert_enabled} is_rtl={true}/>
		<div class="is-size-7">{$_("config.selfprod.desc")}</div>
		<div class:is-hidden={!$config_store.divert_enabled} class="mt-2 mb-0 ml-1 is-flex is-flex-direction-row is-justify-content-left is-align-items-center is-flex-wrap-wrap is-size-7 has-text-weight-bold">
			{#if $uistates_store.divert_type == 0}
			<div class="mr-2 is-inline-block">
				<span>{$_("config.selfprod.production")}:</span>
				<span class="has-text-primary">{$status_store.solar}{$_("units.W")}</span>
			</div>
		
			{:else}
			<div class="mr-2">
				<span>{$_("config.selfprod.grid")}</span>
				<span class="{$status_store.grid_ie < 0 ? "has-text-primary":"has-text-danger"}">{$status_store.grid_ie}W</span>
			</div>
			{/if}
			<div class="mr-2">
				<span>{$_("config.selfprod.availablecur")}:</span>
				<span class="{$status_store.shaper_cur < 6?"has-text-danger":"has-text-primary"}">{$status_store.charge_rate}A</span>
			</div>
			<div class="mr-2" class:is-hidden={!$status_store.smoothed_available_current}>
				<span>{$_("config.selfprod.smoothedcur")}:</span>
				<span class="has-text-info">{round($status_store.smoothed_available_current,1)}A</span>
			</div>
			<div class="mr-2">
				<span class="has-text-weight-bold  is-size-7">{$_("config.selfprod.lastupdated")}:</span>
				<span class="is-size-7 {$status_store.divert_update > 60?"has-text-danger":$status_store.divert_update <= 15?"has-text-primary":"has-text-orange"}">{$divertelapsed}</span>
			</div>
		</div>
		
		<Select title={$_("config.selfprod.mode")} bind:value={$uistates_store.divert_type} items={modes} />
		{#if $uistates_store.divert_type==0}
		<div><InputForm title={$_("config.selfprod.feed")} bind:value={$config_store.mqtt_solar} placeholder="/topic/energy_production" /></div>
		<div class="is-size-7">{$_("config.selfprod.feed-prod-desc")}</div>
		{:else}
		<div><InputForm title={$_("config.selfprod.feed")} bind:value={$config_store.mqtt_grid_ie} placeholder="/topic/grid" /></div>
		
		<div class="is-size-7">{$_("config.selfprod.feed-excess-desc")}</div>
		{/if}
	
		{#if $uistates_store.divert_type==1}
		<div><InputForm title="{$_("config.selfprod.powerratio")}:" type="number" bind:value={$config_store.divert_PV_ratio} placeholder="1.1" /></div>
		<div class="is-size-7">{$_("config.selfprod.powerratio-desc")}</div>
		{/if}
		<div><InputForm title="{$_("config.selfprod.smoothattack")}:" type="number" bind:value={$config_store.divert_attack_smoothing_factor} placeholder="0.4" /></div>
		<div class="is-size-7">{$_("config.selfprod.smoothattack-desc")}</div>
		<div><InputForm title="{$_("config.selfprod.smoothdecay")}:" type="number" bind:value={$config_store.divert_decay_smoothing_factor} placeholder="0.005" /></div>
		<div class="is-size-7">{$_("config.selfprod.smoothdecay-desc")}</div>
		<div><InputForm title="{$_("config.selfprod.minchargetime")}:" type="number" bind:value={$config_store.divert_min_charge_time} placeholder="600" /></div>
		<div class="is-size-7">{$_("config.selfprod.minchargetime-desc")}.</div>
		<div class="block mt-5 pb-1">
			<Button name={$_("save")} color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
		</div>
		<AlertBox title={$_("error")}  body={alert_body} bind:visible={alert_visible} />
	</div>
	
</Box>