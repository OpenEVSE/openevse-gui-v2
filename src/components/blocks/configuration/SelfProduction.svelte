<script>
	import Checkbox from "./../../ui/Checkbox.svelte";
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

	let preset = 3

	const presets = [
		{
			name: "Default",
			desc: "Slowly decrease charge rate, using grid to compensate, but increase faster when energy is going back.",
			id: 0,
			divert_attack_smoothing_time: 20,
			divert_decay_smoothing_time: 600,
			divert_min_charge_time: 600,
			divert_PV_ratio: 1.1
		},
		{
			name: "No waste",
			desc: "No waste of produced energy. Same as default but will import more from the grid to not waste any solar energy",
			id: 1,
			divert_attack_smoothing_time: 20,
			divert_decay_smoothing_time: 600,
			divert_min_charge_time: 600,
			divert_PV_ratio: 0.5
		},
		{
			name: "No import",
			desc: "Try to limit grid usage. Will slow down the charge rate quickly, but increase slower when energy is going back.",
			id: 2,
			divert_attack_smoothing_time: 300,
			divert_decay_smoothing_time: 20,
			divert_min_charge_time: 600,
			divert_PV_ratio: 1.1
		},
		{
			name: "Custom",
			id: 3,
			divert_attack_smoothing_time: 20,
			divert_decay_smoothing_time: 600,
			divert_min_charge_time: 600,
			divert_PV_ratio: 1.1
		}
	]

	let formdata = {
		divert_enabled:	  				{val: false,	input: undefined, status: "", req: false},
		divert_type:					{val: -1,		input: undefined, status: "", req: false},
		charge_mode:					{val: "eco",	input: undefined, status: "", req: false},
		mqtt_solar: 	  				{val: "",		input: undefined, status: "", req: false},
		mqtt_grid_ie: 	  				{val: "",		input: undefined, status: "", req: false},
		divert_PV_ratio:  				{val: "",		input: undefined, status: "", req: true},
		divert_attack_smoothing_time:   {val: "",		input: undefined, status: "", req: true},
		divert_decay_smoothing_time:	{val: "",		input: undefined, status: "", req: true},
		divert_min_charge_time:			{val: "",		input: undefined, status: "", req: true}
	}

	const updateFormData = () => {
		formdata.divert_enabled.val 			 	= $config_store.divert_enabled
		formdata.divert_type.val					= $config_store.divert_type != -1 ? $config_store.divert_type : 0
		formdata.charge_mode.val					= $config_store.charge_mode
		formdata.mqtt_solar.val						= $config_store.mqtt_solar
		formdata.mqtt_grid_ie.val					= $config_store.mqtt_grid_ie
		formdata.divert_PV_ratio.val				= $config_store.divert_PV_ratio
		formdata.divert_attack_smoothing_time.val	= $config_store.divert_attack_smoothing_time
		formdata.divert_decay_smoothing_time.val	= $config_store.divert_decay_smoothing_time
		formdata.divert_min_charge_time.val			= $config_store.divert_min_charge_time
	}

	let toggleDivert = async () => {
		await submitFormData({form: formdata, prop_enable: "divert_enabled", i18n_path: "config.selfprod.missing-"})
	}
	let setProperty = async (prop) => {
		$config_store[prop] = formdata[prop].val
		preset = get_preset()
		await submitFormData({prop: prop, form: formdata , prop_enable: "divert_enabled", i18n_path: "config.selfprod.missing-"})
		
	}

	let setDivertType = async () => {
		await setProperty("divert_type")
		await submitFormData({form: formdata, prop_enable: "divert_enabled", i18n_path: "config.selfprod.missing-"})
	}

	let setChargeMode = async () => {
		formdata.charge_mode.val = formdata.charge_mode.input.checked ? "eco" : "fast"
		setProperty("charge_mode")
	}


	let set_preset = async (id) => {
		if (presets[id] && id != 3) {
			$config_store.divert_attack_smoothing_time = presets[id].divert_attack_smoothing_time
			$config_store.divert_decay_smoothing_time = presets[id].divert_decay_smoothing_time
			$config_store.divert_min_charge_time = presets[id].divert_min_charge_time
			$config_store.divert_PV_ratio = presets[id].divert_PV_ratio
			updateFormData()
			preset = get_preset()
			await submitFormData({form: formdata, prop_enable: "divert_enabled", i18n_path: "config.selfprod.missing-"})

		}
		preset = id
	}
	let get_preset = () => {
		let ps = 3
		for (let i=0; i<3; i++) {
			if ($config_store.divert_attack_smoothing_time == presets[i].divert_attack_smoothing_time
			&& $config_store.divert_decay_smoothing_time == presets[i].divert_decay_smoothing_time
			&& $config_store.divert_min_charge_time == presets[i].divert_min_charge_time
			&& $config_store.divert_PV_ratio == presets[i].divert_PV_ratio)
				ps = i
		}
		return ps
	}

	onMount(()=>{
		updateFormData()
		Object.keys(formdata).forEach(key => {
			if (formdata[key].val == undefined) {
				formdata[key].val = ""
			}
		})
		preset = get_preset();
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
			<div class="is-flex is-justify-content-center">
				<Borders grow>
					<div class="has-text-weight-bold has-text-dark">{$_("config.selfprod.defaultmode")}</div>
					<Switch
							name="divertbootstate"
							bind:this={formdata.charge_mode.input}
							checked={formdata.charge_mode.val=="eco"?true:false}
							bind:status={formdata.charge_mode.status} 
							label={formdata.charge_mode.val?$_("yes"):$_("no")} 
							disabled={formdata.charge_mode.status=="loading"}
							onChange={() => setChargeMode()}
							/>
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
					
					<div class="mb-2 is-flex is-justify-content-center">
						<Borders>
							<div class="is-size-6 has-text-dark has-text-weight-bold mb-2">
							Filter Settings
						</div>
						<div class="is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-space-evenly">
							{#key preset}
							{#each presets as setting}
							<div class="mx-2">
								<Checkbox 
									bold
									color="info"
									checked={preset == setting.id}
									onChange={() => {set_preset(setting.id)}}
									label={setting.name}
									tooltip={setting.desc}
								/>	
							</div>
							{/each}
							{/key}
						</div>
						<div class="mb-2" >
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
						<div class="mb-2">
							<InputForm 
								title="{$_("config.selfprod.smoothattack")}*"
								bind:this={formdata.divert_attack_smoothing_time.input}
								bind:value={formdata.divert_attack_smoothing_time.val}
								bind:status={formdata.divert_attack_smoothing_time.status}
								min=0 max=600 step="1"
								onChange={()=>setProperty("divert_attack_smoothing_time")} 
							/>
							<div class="is-size-7 has-text-left">{$_("config.selfprod.smoothattack-desc")}</div>
						</div>
						
			
						<div class="mb-2">
							<InputForm 
								title="{$_("config.selfprod.smoothdecay")}*"
								bind:this={formdata.divert_decay_smoothing_time.input}
								bind:value={formdata.divert_decay_smoothing_time.val}
								bind:status={formdata.divert_decay_smoothing_time.status}
								min=0 max=600 step="1"
								onChange={()=>setProperty("divert_decay_smoothing_time")} 
							/>
							<div class="is-size-7 has-text-left">{$_("config.selfprod.smoothdecay-desc")}</div>
						</div>

						</Borders>
						
					</div>
				</div>
				</Borders>
			</div>
		</div>
	</div>
	
</Box>
{/if}