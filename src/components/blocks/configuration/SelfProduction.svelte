<script>
	import SliderForm from "./../../ui/SliderForm.svelte";
	import { uisettings_store } from "./../../../lib/stores/uisettings.js";
	import Borders 			  from "./../../ui/Borders.svelte";
	import { onMount }		  from "svelte";
	import { _ } 			  from 'svelte-i18n'
	import { uistates_store } from "./../../../lib/stores/uistates.js";
	import { derived }		  from "svelte/store"
	import { status_store }   from "./../../../lib/stores/status.js";
	import { config_store }   from "./../../../lib/stores/config.js";
	import {s2mns, round} 	  from "../../../lib/utils.js"
	import { submitFormData } from "./../../../lib/utils.js";
	import SelfProductionHelp from "./../../help/SelfProductionHelp.svelte";
	import Select 			  from "./../../ui/Select.svelte";
	import InputForm 		  from "./../../ui/InputForm.svelte";
	import Box 				  from "../../ui/Box.svelte";
	import Switch 			  from "./../../ui/Switch.svelte";
	
	let mounted = false
	let modes = [
		{name: $_("config.selfprod.production"), value: 0},
		{name:$_("config.selfprod.excess"), value: 1}
	]
	let divertelapsed = derived(uistates_store, store => s2mns(store.divert_update))

	let formdata = {
		divert_enabled:	  				{val: false,	input: undefined, status: "", req: false},
		divert_type:					{val: -1,		input: undefined, status: "", req: false},
		charge_mode:					{val: "eco",	input: undefined, status: "", req: false},
		mqtt_solar: 	  				{val: "",		input: undefined, status: "", req: false},
		mqtt_grid_ie: 	  				{val: "",		input: undefined, status: "", req: false},
		divert_PV_ratio:  				{val: "",		input: undefined, status: "", req: true},
		divert_attack_smoothing_factor: {val: "",		input: undefined, status: "", req: true},
		divert_decay_smoothing_factor:	{val: "",		input: undefined, status: "", req: true},
		divert_min_charge_time:			{val: "",		input: undefined, status: "", req: true}
	}

	const updateFormData = () => {
		formdata.divert_enabled.val 			 	= $config_store.divert_enabled
		formdata.divert_type.val					= $config_store.divert_type != -1 ? $config_store.divert_type : 0
		formdata.charge_mode.val					= $config_store.charge_mode
		formdata.mqtt_solar.val						= $config_store.mqtt_solar
		formdata.mqtt_solar.req 					= $uistates_store.divert_type?true:false
		formdata.mqtt_grid_ie.val					= $config_store.mqtt_grid_ie
		formdata.mqtt_grid_ie.req 					= $uistates_store.divert_type?false:true
		formdata.divert_PV_ratio.val				= $config_store.divert_PV_ratio
		formdata.divert_attack_smoothing_factor.val	= $config_store.divert_attack_smoothing_factor
		formdata.divert_decay_smoothing_factor.val	= $config_store.divert_decay_smoothing_factor
		formdata.divert_min_charge_time.val			= $config_store.divert_min_charge_time
	}

	let toggleDivert = async () => {
		if (formdata.divert_enabled.val) {
			formdata.charge_mode.val = "eco"
		}
		await submitFormData({form: formdata, prop_enable: "divert_enabled", i18n_path: "config.selfprod.missing-"})
	}
	let setProperty = async (prop) => {
		await submitFormData({prop: prop, form: formdata , prop_enable: "divert_enabled", i18n_path: "config.selfprod.missing-"})
	}

	let setDivertType = async () => {
		await setProperty("divert_type")
		await submitFormData({form: formdata, prop_enable: "divert_enabled", i18n_path: "config.selfprod.missing-"})
	}


	onMount(()=>{
		updateFormData()
		Object.keys(formdata).forEach(key => {
			if (formdata[key].val == undefined) {
				formdata[key].val = ""
			}
		})
		mounted = true
	})

</script>

<style>
	.has-text-orange {
		color: orange;
	}
</style>

{#if mounted}
<Box title={$_("config.titles.selfprod")} has_help={true} icon="fa6-solid:solar-panel" back={true}>
	<div slot="help"><SelfProductionHelp  /> </div>
	<div class="columns is-centered">
		<div class="column is-three-quarters is-full-mobile">
			
			<div class="mb-2 is-flex is-justify-content-center">
				<Borders classes={formdata.divert_enabled.val?"has-background-primary-light":"has-background-light"}>
					<div class="enable">
						<Switch
							name="divertswitch"
							bind:this={formdata.divert_enabled.input}
							bind:checked={formdata.divert_enabled.val}
							bind:status={formdata.divert_enabled.status} 
							label={formdata.divert_enabled.val?$_("enabled"):$_("disabled")} 
							disabled={formdata.divert_enabled.status=="loading"}
							onChange={toggleDivert}
							/>
						<div class:is-hidden={!$config_store.divert_enabled} class="mt-2 mb-0 ml-1 is-flex is-flex-direction-row is-justify-content-left is-align-items-center is-flex-wrap-wrap is-size-7 has-text-weight-bold">	
							<div class="mr-2 is-inline-block">
								{#if $config_store.divert_type == 0}
								<span>{$_("config.selfprod.production")}:</span>
								<span class="has-text-primary">{$status_store.solar}{$_("units.W")}</span>
								{:else if $config_store.divert_type == 1}
								<span>{$_("config.selfprod.grid")}</span>
								<span class="{$status_store.grid_ie < 0 ? "has-text-primary":"has-text-danger"}">{$status_store.grid_ie}W</span>
								{/if}
								<span>|</span>
								<span class="{$status_store.charge_rate < 6?"has-text-danger":"has-text-primary"}">{$status_store.charge_rate}A</span>
							</div>
							{#if $status_store.divert_active}
							<div class="mr-2 has-text-dark" class:is-hidden={!$status_store.smoothed_available_current}>
								<span>{$_("status-divert-smoothed")}:</span>
								<span class="has-text-info">{round($status_store.smoothed_available_current,1)}A</span>
							</div>
							{:else}
							<div class="mx-1">
								{#if $config_store.charge_mode == "eco"}
								<span class="has-text-info">{$_("config.selfprod.disabled")}</span>
								{:else}
								<span class="has-text-info">{$_("config.selfprod.modeboost")}</span>
								{/if}
							</div>
							{/if}
							<div class="mr-2">
								<span class="has-text-weight-bold  is-size-7">{$_("config.selfprod.lastupdated")}:</span>
								<span class="is-size-7 {$status_store.divert_update > 60?"has-text-danger":$status_store.divert_update <= 15?"has-text-primary":"has-text-orange"}">{$divertelapsed}</span>
							</div>
						</div>
					</div>
				</Borders>
			</div>
			<div class="is-size-7 mb-2 ">{$_("config.selfprod.desc")}</div>
			<div class="mb-2 is-flex is-justify-content-center">
				<Borders grow={true}>
					<Select title={$_("config.selfprod.mode")} bind:value={formdata.divert_type.val} items={modes} onChange={setDivertType}/>
	
				<div class="is-inline-block">
					<div class:is-hidden={$config_store.divert_type==1} class="mb-2">
						<InputForm
							title="{$_("config.selfprod.feed")}*" 
							placeholder="/topic/pv_production" 
							bind:this={formdata.mqtt_solar.input}
							bind:value={formdata.mqtt_solar.val} 
							bind:status={formdata.mqtt_solar.status} 
							onChange={()=>setProperty("mqtt_solar")}
						/>
						<div class="is-size-7 has-text-left">{$_("config.selfprod.feed-prod-desc")}</div>
					</div>
	
		
					<div class:is-hidden={$config_store.divert_type==0} class="mb-2">
						<InputForm 
							title="{$_("config.selfprod.feed")}*"
							placeholder="/topic/grid_ie"
							bind:this={formdata.mqtt_grid_ie.input}
							bind:value={formdata.mqtt_grid_ie.val} 
							bind:status={formdata.mqtt_grid_ie.status} 
							onChange={()=>setProperty("mqtt_grid_ie")}
						/>
						<div class="is-size-7 has-text-left">{$_("config.selfprod.feed-excess-desc")}</div>
					</div>
					<div class:is-hidden={$config_store.divert_type==0} class="mb-2" >
						<InputForm 
							title="{$_("config.selfprod.powerratio")}*" 
							type="number" 
							placeholder="1.1"
							step="0.01"
							bind:this={formdata.divert_PV_ratio.input}
							bind:value={formdata.divert_PV_ratio.val} 
							bind:status={formdata.divert_PV_ratio.status}
							onChange={()=>setProperty("divert_PV_ratio")}
						/>
						<div class="is-size-7 has-text-left">{$_("config.selfprod.powerratio-desc")}</div>
					</div>
					<div class="mb-2">
						<!-- <InputForm 
							title="{$_("config.selfprod.smoothattack")}*" 
								type="number" 
								placeholder="0.4"
								step="0.01" 
								min="0.001"
								max="1"
								bind:this={formdata.divert_attack_smoothing_factor.input}
								bind:value={formdata.divert_attack_smoothing_factor.val} 
								bind:status={formdata.divert_attack_smoothing_factor.status}
								onChange={()=>setProperty("divert_attack_smoothing_factor")}
						/> -->
						<SliderForm 
							label="{$_("config.selfprod.smoothattack")}*"
							bind:this={formdata.divert_attack_smoothing_factor.input}
							bind:value={formdata.divert_attack_smoothing_factor.val} 
							min=0.01 max=1.0 step="0.01"
							color="has-text-dark"
							onchange={()=>setProperty("divert_attack_smoothing_factor")} 
						/>
						<div class="is-size-7 has-text-left">{$_("config.selfprod.smoothattack-desc")}</div>
					</div>
					
		
					<div class="mb-2">
						<!-- <InputForm 
							title="{$_("config.selfprod.smoothdecay")}*" 
							type="number" 
							placeholder="0.05"
							step="0.01"
							min="0.001"
							max="1"
							bind:this={formdata.divert_decay_smoothing_factor.input}
							bind:value={formdata.divert_decay_smoothing_factor.val} 
							bind:status={formdata.divert_decay_smoothing_factor.status}
							onChange={()=>setProperty("divert_decay_smoothing_factor")}
						/> -->
						<SliderForm 
							label="{$_("config.selfprod.smoothdecay")}*"
							bind:value={formdata.divert_decay_smoothing_factor.val} 
							min=0.01 max=1.0 step="0.01"
							color="has-text-dark"
							onchange={()=>setProperty("divert_decay_smoothing_factor")} 
						/>
						<div class="is-size-7 has-text-left">{$_("config.selfprod.smoothdecay-desc")}</div>
					</div>
					
					
					<div class="mb-2">
						<InputForm
							title="{$_("config.selfprod.minchargetime")}*" 
							type="number" 
							placeholder="600"
							min="0"
							step="1"
							bind:this={formdata.divert_min_charge_time.input}
							bind:value={formdata.divert_min_charge_time.val} 
							bind:status={formdata.divert_min_charge_time.status}
							onChange={()=>setProperty("divert_min_charge_time")}
						/>
						<div class="is-size-7 has-text-left">{$_("config.selfprod.minchargetime-desc")}.</div>
					</div>
				</div>
				</Borders>
			</div>
		</div>
	</div>
	
</Box>
{/if}