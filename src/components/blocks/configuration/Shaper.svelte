<script>
	import ShaperHelp from "./../../help/ShaperHelp.svelte";
	import Borders from "./../../ui/Borders.svelte";
	import { onMount } from "svelte";
	import { _ } 			    from 'svelte-i18n'
	import { get }				from 'svelte/store'
	import { status_store } 	from "./../../../lib/stores/status.js";
	import { config_store } 	from "../../../lib/stores/config.js";
	import { submitFormData,
			 postFormData } 	from "./../../../lib/utils.js"
	import InputForm 			from "../../ui/InputForm.svelte";
	import Box 					from "../../ui/Box.svelte";
	import Switch 				from "../../ui/Switch.svelte";
	import AlertBox 			from "../../ui/AlertBox.svelte"
	
	let alert_body
	let alert_visible = false
	let mounted = false
	let formdata = {
			current_shaper_enabled: {val: false, status: "", input: undefined, req: false},
			current_shaper_max_pwr:	{val: null, status: "", input: undefined, req: true},
			mqtt_live_pwr:			{val: null, status: "", input: undefined, req: false}
		}	

	let updateFormData = () => {
		formdata.current_shaper_enabled.val = $config_store.current_shaper_enabled
		formdata.current_shaper_max_pwr.val = $config_store.current_shaper_max_pwr
		formdata.mqtt_live_pwr.val = $config_store.mqtt_live_pwr	
	}

	let toggleShaper = async () => {
		const res = await submitFormData({form: formdata, prop_enable: "current_shaper_enabled", i18n_path: "config.shaper.missing-"})
		if (!res.ok) {
			alert_body = res.msg
			alert_visible = true
		}
	}


	let setProperty = async (prop,form) => {
		const res = await submitFormData({prop: prop, form: form, prop_enable: "current_shaper_enabled", i18n_path: "config.shaper.missing-"})
		if (!res.ok) {
			alert_body = res.msg
			alert_visible = true
		}
	}


	onMount( () => {
		updateFormData()
		mounted = true

	})

	$: formdata = formdata
</script>

{#if mounted}
<Box title={$_("config.titles.shaper")} icon="fa6-solid:building-shield" back={true} has_help={true} >
	<div slot="help"><ShaperHelp /></div>
	<div class="mb-2 is-flex is-align-items-center is-justify-content-center">
		<Borders classes={formdata.current_shaper_enabled.val?"has-background-primary-light":"has-background-light"}>
			<Switch name="shaperswitch" bind:this={formdata.current_shaper_enabled.input} label={$_("config.shaper.enable")} onChange={toggleShaper} bind:checked={formdata.current_shaper_enabled.val} bind:status={formdata.current_shaper_enabled.status} disabled={formdata.current_shaper_enabled.status == "loading"}/>
			{#if formdata.current_shaper_enabled.val}
			<div class="pb-1 my-3">
				<div class="is-size-7 {$status_store.shaper_updated?"has-text-info":"has-text-danger"}">{$status_store.shaper_updated?$_("config.shaper.updated"):$_("config.shaper.notupdated")}</div>
				<span class="is-size-7 has-text-weight-bold">{$_("config.shaper.load")}: <span class="has-text-info">{$status_store.shaper_live_pwr} {$_("units.W")}</span></span>
				<span class="is-size-7 has-text-weight-bold">{$_("config.shaper.curavail")}: <span class="{$status_store.shaper_cur < 6?"has-text-danger":"has-text-primary"}">{$status_store.shaper_cur} {$_("units.A")}</span></span>
			</div>
			{/if}	
		</Borders>
	</div>

	<div class="is-size-7">{$_("config.shaper.shaperdesc")}</div>
	<div>
		<InputForm title="{$_("config.shaper.maxpower")}*:" 
		bind:this={formdata.current_shaper_max_pwr.input} 
		type="number" bind:value={formdata.current_shaper_max_pwr.val} 
		bind:status={formdata.current_shaper_max_pwr.status} 
		disabled={formdata.current_shaper_max_pwr.status == "loading"} 
		placeholder="9000" 
		onChange={()=>setProperty("current_shaper_max_pwr",formdata)}
		/>
	</div>
	<div>
		<InputForm title="{$_("config.shaper.livepower")}:" 
		bind:this={formdata.mqtt_live_pwr.input} 
		bind:value={formdata.mqtt_live_pwr.val} 
		bind:status={formdata.mqtt_live_pwr.status} 
		disabled={formdata.mqtt_live_pwr.status =="loading"} 
		placeholder="/topic/powerload" 
		onChange={()=>setProperty("mqtt_live_pwr",formdata)} 
		/>
	</div>
	<div class="block mt-5 pb-1">
	<AlertBox title={$_("error")} body={alert_body} bind:visible={alert_visible} />
</Box>
{/if}