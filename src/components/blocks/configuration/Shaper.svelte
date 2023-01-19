<script>
	import Borders from "./../../ui/Borders.svelte";
	import { onMount } from "svelte";
	import { _ } 			    from 'svelte-i18n'
	import { status_store } 	from "./../../../lib/stores/status.js";
	import { config_store } 	from "../../../lib/stores/config.js";
	import { validateFormData,
			 postFormData } 	from "./../../../lib/utils.js"
	import InputForm 			from "../../ui/InputForm.svelte";
	import Box 					from "../../ui/Box.svelte";
	import Switch 				from "../../ui/Switch.svelte";
	import AlertBox 			from "../../ui/AlertBox.svelte"

	let alert_body
	let alert_visible = false
	let mounted = false
	let formdata

	let updateFormData = () => {
		formdata = {
			current_shaper_enabled: {val: $config_store.current_shaper_enabled?$config_store.current_shaper_enabled:false, state: "", req: false},
			current_shaper_max_pwr:	{val: $config_store.current_shaper_max_pwr?$config_store.current_shaper_max_pwr:"", state: "", req: true},
			mqtt_live_pwr:			{val: $config_store.mqtt_live_pwr?$config_store.mqtt_live_pwr:"", state: "", req: true}
		}	
	}

	let toggleShaper = async () => {	
		let valid = validateFormData(formdata, "config.shaper.missing-",$config_store.shaper_enabled)
		if (valid.ok) {
			formdata.current_shaper_enabled.state = "loading"
			if (await postFormData(valid.data)) {
				formdata.current_shaper_enabled.state = "ok"
				return true
			}
			else {
				formdata.current_shaper_enabled.state = "error"
				return false
			}
		}
		else {
			formdata.current_shaper_enabled.val = false
			alert_body = valid.msg
			alert_visible = true 
			return false
		}
	}

	let setProperty = async (prop) => {
		let propdata = {}
		propdata[prop] = {val: formdata[prop].val, state: "", req: formdata[prop].req}
		let valid = validateFormData(propdata, "config.shaper.missing-", false, formdata)
		if (valid.ok) {
			formdata[prop].state = "loading"
			if (await postFormData(valid.data)) {
				formdata[prop].state = "ok"
				return true
			}				
			else {
				formdata[prop].state = "error"
				return false
			}
		}
		else {
			alert_body = valid.msg
			alert_visible = true
			formdata[prop].val = $config_store[prop]
			return false
		}
	}


	onMount( () => {
		updateFormData()
		mounted = true

	})

</script>

{#if mounted}
<Box title={$_("config.titles.shaper")} icon="fa6-solid:building-shield" back={true} >
	<div class="mb-2 is-flex is-align-items-center is-justify-content-center">
		<Borders classes={formdata.current_shaper_enabled.val?"has-background-primary-light":"has-background-light"}>
			<Switch name="shaperswitch" label={$_("config.shaper.enable")} onChange={toggleShaper} bind:checked={formdata.current_shaper_enabled.val} disabled={formdata.current_shaper_enabled.state == "loading"}/>
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
	<div><InputForm title="{$_("config.shaper.maxpower")}:" type="number"  bind:status={formdata.current_shaper_max_pwr.state} bind:value={formdata.current_shaper_max_pwr.val} placeholder="9000" onChange={()=>setProperty("current_shaper_max_pwr")}/></div>
	<div><InputForm title="{$_("config.shaper.livepower")}:" bind:status={formdata.mqtt_live_pwr.state} bind:value={formdata.mqtt_live_pwr.val} placeholder="/topic/powerload"  onChange={()=>setProperty("mqtt_live_pwr")} /></div>
	<div class="block mt-5 pb-1">
		<!-- <Button name={$_("save")} color="is-info" state={stg_submit_state} butn_submit={stg_submit} /> -->
	</div>
	<AlertBox title={$_("error")} body={alert_body} bind:visible={alert_visible} />
</Box>
{/if}