<script>
	import SliderForm from "./../../ui/SliderForm.svelte";
	import ShaperHelp			from "../../help/ShaperHelp.svelte";
	import Borders 				from "./../../ui/Borders.svelte";
	import { onMount } 			from "svelte";
	import { _ } 			    from 'svelte-i18n'
	import { status_store } 	from "./../../../lib/stores/status.js";
	import { config_store } 	from "../../../lib/stores/config.js";
	import { submitFormData,
			round } 			from "./../../../lib/utils.js"
	import InputForm 			from "../../ui/InputForm.svelte";
	import Box 					from "../../ui/Box.svelte";
	import Switch 				from "../../ui/Switch.svelte";
	
	let mounted = false
	let formdata = {
			current_shaper_enabled: {val: false, status: "", input: undefined, req: false},
			current_shaper_max_pwr:	{val: null,  status: "", input: undefined, req: true},
			current_shaper_smoothing_time: {val: null, status: "", input: undefined, req: true},
			current_shaper_min_pause_time: {val: null, status: "", input: undefined, req: true},
			current_shaper_data_maxinterval: {val: null, status: "", input: undefined, req: true},
			mqtt_live_pwr:			{val: null,  status: "", input: undefined, req: false}
		}	

	let updateFormData = () => {
		formdata.current_shaper_enabled.val = $config_store.current_shaper_enabled
		formdata.current_shaper_max_pwr.val = $config_store.current_shaper_max_pwr
		formdata.current_shaper_smoothing_time.val = $config_store.current_shaper_smoothing_time
		formdata.current_shaper_min_pause_time.val = $config_store.current_shaper_min_pause_time
		formdata.current_shaper_data_maxinterval.val = $config_store.current_shaper_data_maxinterval
		formdata.mqtt_live_pwr.val 			= $config_store.mqtt_live_pwr	
	}

	let toggleShaper = async () => {
		await submitFormData({form: formdata, prop_enable: "current_shaper_enabled", i18n_path: "config.shaper.missing-"})
	}


	let setProperty = async (prop) => {
		await submitFormData({prop: prop, form: formdata , prop_enable: "current_shaper_enabled", i18n_path: "config.shaper.missing-"})
	}


	onMount( () => {
		updateFormData()
		mounted = true

	})

	// $: formdata = formdata
</script>

{#if mounted}
<Box title={$_("config.titles.shaper")} icon="fa6-solid:building-shield" back={true} has_help={true} >
	<div slot="help"><ShaperHelp /></div>
	<div class="columns is-centered">
		<div class="column is-three-quarters is-full-mobile">
			<div class="mb-2 is-flex is-align-items-center is-justify-content-center">
				<Borders classes={formdata.current_shaper_enabled.val?"has-background-primary-light":"has-background-light"}>
					<Switch 
						name="shaperswitch" 
						label={$_("enable")} 
						onChange={toggleShaper} 
						bind:this={formdata.current_shaper_enabled.input} 
						bind:checked={formdata.current_shaper_enabled.val} 
						bind:status={formdata.current_shaper_enabled.status} 
						disabled={formdata.current_shaper_enabled.status == "loading"}
						/>
					
					{#if formdata.current_shaper_enabled.val}
					<div class="pb-1 my-3">
						<div class="is-size-7 {$status_store.shaper_updated?"has-text-info":"has-text-danger"}">
							{$status_store.shaper_updated?$_("config.shaper.updated"):$_("config.shaper.notupdated")}
						</div>
						<span class="is-size-7 has-text-weight-bold has-text-dark">
							{$_("config.shaper.load")}: 
							<span class="has-text-info">{$status_store.shaper_live_pwr} {$_("units.W")}</span>
							</span>
							<span class="is-size-7 has-text-weight-bold has-text-dark">
								{$_("config.shaper.available")}: 
								<span class="{$status_store.shaper_cur < 6?"has-text-danger":"has-text-primary"}">
								{round($status_store.shaper_cur,2)} {$_("units.A")}
							</span>
						</span>
					</div>
					{/if}	
				</Borders>
			</div>

			<div class="is-size-7 mb-2 has-text-centered">{$_("config.shaper.shaperdesc")}</div>
			<div class="is-flex is-justify-content-center">
				<Borders grow>
					<div>
						<InputForm 
							title="{$_("config.shaper.maxpower")}*" 
							bind:this={formdata.current_shaper_max_pwr.input} 
							type="number" bind:value={formdata.current_shaper_max_pwr.val} 
							bind:status={formdata.current_shaper_max_pwr.status} 
							disabled={formdata.current_shaper_max_pwr.status == "loading"} 
							placeholder="9000" 
							onChange={()=>setProperty("current_shaper_max_pwr")}
						/>
					</div>
					<div>
						<InputForm
							title="{$_("config.shaper.livepower")}" 
							bind:this={formdata.mqtt_live_pwr.input} 
							bind:value={formdata.mqtt_live_pwr.val} 
							bind:status={formdata.mqtt_live_pwr.status} 
							disabled={formdata.mqtt_live_pwr.status =="loading"} 
							placeholder="/topic/powerload" 
							onChange={()=>setProperty("mqtt_live_pwr")} 
						/>
					</div>
					<div>
						<InputForm 
							title="{$_("config.shaper.minpausetime")}*" 
							bind:this={formdata.current_shaper_min_pause_time.input} 
							type="number" bind:value={formdata.current_shaper_min_pause_time.val} 
							min=0 max=60 step=1
							bind:status={formdata.current_shaper_min_pause_time.status} 
							disabled={formdata.current_shaper_min_pause_time.status == "loading"} 
							placeholder="5" 
							onChange={()=>setProperty("current_shaper_min_pause_time")}
						/>
					</div>
					<div>
						<InputForm 
							title="{$_("config.shaper.maxinterval")}*" 
							bind:this={formdata.current_shaper_data_maxinterval.input} 
							type="number" bind:value={formdata.current_shaper_data_maxinterval.val} 
							min=10 max=300 step=1
							bind:status={formdata.current_shaper_data_maxinterval.status} 
							disabled={formdata.current_shaper_data_maxinterval.status == "loading"} 
							placeholder="120" 
							onChange={()=>setProperty("current_shaper_data_maxinterval")}
						/>
						<div class="is-size-7 has-text-left">{$_("config.shaper.maxinterval-desc")}</div>
					</div>
					<div class="mb-2">
						<InputForm
							title="{$_("config.shaper.smoothing")}*"
							bind:value={formdata.current_shaper_smoothing_time.val} 
							bind:this={formdata.current_shaper_smoothing_time.input}
							min=0 max=600 step=1
							onChange={()=>setProperty("current_shaper_smoothing_time")} 
						/>
						<div class="is-size-7 has-text-left">{$_("config.shaper.smoothing-desc")}</div>
					</div>

					<div class="block mt-5 pb-1">
				</Borders>
			</div>
		</div>
	</div>
</Box>
{/if}