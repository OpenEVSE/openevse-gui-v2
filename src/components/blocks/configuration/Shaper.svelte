<script>
	import { _ } 			    from 'svelte-i18n'
	import { status_store } 	from "./../../../lib/stores/status.js";
	import { config_store } 	from "../../../lib/stores/config.js";
	import { serialQueue } 		from "../../../lib/queue.js";
	import InputForm 			from "../../ui/InputForm.svelte";
	import Box 					from "../../ui/Box.svelte";
	import Button				from "../../ui/Button.svelte";
	import Switch 				from "../../ui/Switch.svelte";
	import AlertBox 			from "../../ui/AlertBox.svelte"

	let stg_submit_state
	let alert_body
	let alert_visible = false

	async function toggleShaper() {	
		let res = await serialQueue.add(() => config_store.saveParam("current_shaper_enabled", $config_store.current_shaper_enabled))
	}

	let stg_submit = async () => {
		if (!$config_store.current_shaper_max_pwr) {
			alert_body = "Max Power allowed is missing"
			alert_visible=true
			return
		}
		else if (!$config_store.mqtt_live_pwr) {
			alert_body = "Live power load MQTT Topic is missing"
			alert_visible=true
			return
		}
		stg_submit_state = "loading"
	
		const data = {
			current_shaper_max_pwr: $config_store.current_shaper_max_pwr,
			mqtt_live_pwr: $config_store.mqtt_live_pwr
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
</script>

<Box title={$_("config.titles.shaper")} icon="fa6-solid:building-shield" back={true}>
	<div class="my-3" class:is-hidden={!$config_store.current_shaper_enabled}>
		<div class="is-size-7 {$status_store.shaper_updated?"has-text-primary":"has-text-danger"}">{$status_store.shaper_updated?$_("config.shaper.updated"):$_("config.shaper.notupdated")}</div>
		<span class="is-size-7 has-text-weight-bold">{$_("config.shaper.load")}: <span class="has-text-info">{$status_store.shaper_live_pwr} {$_("units.W")}</span></span>
		<span class="is-size-7 has-text-weight-bold">{$_("config.shaper.curavail")}: <span class="{$status_store.shaper_cur < 6?"has-text-danger":"has-text-primary"}">{$status_store.shaper_cur} {$_("units.A")}</span></span>
	</div>
	<div>
		<Switch name="shaperswitch" label={$_("config.shaper.enable")} onChange={toggleShaper} bind:checked={$config_store.current_shaper_enabled}/>
	</div>
	<div class="is-size-7">{$_("config.shaper.shaperdesc")}</div>
	<div><InputForm title="{$_("config.shaper.maxpower")}:" type="number" bind:value={$config_store.current_shaper_max_pwr} placeholder="9000" /></div>
	<div><InputForm title="{$_("config.shaper.livepower")}:" bind:value={$config_store.mqtt_live_pwr} placeholder="/topic/powerload" /></div>
	<div class="block mt-5 pb-1">
		<Button name={$_("save")} color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
	</div>
	<AlertBox body={alert_body} bind:visible={alert_visible} />
</Box>