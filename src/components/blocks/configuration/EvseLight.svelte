<script>
	import { _ } 			 from 'svelte-i18n'
	import Borders 			 from "./../../ui/Borders.svelte";
	import Select			 from "./../../ui/Select.svelte";
	import Help				 from "./../../ui/Help.svelte";
	import Switch			 from "./../../ui/Switch.svelte";
	import { serialQueue }	 from "./../../../lib/queue.js";
	import SliderForm 		 from "./../../ui/SliderForm.svelte";
	import { config_store }  from "./../../../lib/stores/config.js";
	import InputForm 		 from "./../../ui/InputForm.svelte";
	import Box 				 from "./../../ui/Box.svelte";

	let input_random_start
	let select_service_level = ""
	const service_items = [{name: "Auto", value: 0},{name: "Level 1", value: 1},{name: "Level 2", value: 2}]

	async function onChange(prop,val) {
		input_random_start = "loading"
		let res = await serialQueue.add(()=>config_store.saveParam(prop, val))
		if (await res) {
			input_random_start= "ok" 
		}
		else input_random_start = "error" 
		return res
	}

	async function setMaxCurrent() {
		let res = await serialQueue.add(()=>config_store.saveParam("max_current_soft",$config_store.max_current_soft))
	}
	async function setLed() {
		console.log("led brightn: " + $config_store.led_brightness)
		let res = await serialQueue.add(()=>config_store.saveParam("led_brightness",$config_store.led_brightness))
	}

	async function togglePauseMode() {
		let res = await serialQueue.add(()=>config_store.saveParam("pause_uses_disabled",$config_store.pause_uses_disabled))
	}

	async function setServiceLevel() {
		select_service_level = "loading"
		let res = await serialQueue.add(()=>config_store.saveParam("service",$config_store.service))
		if (res)
			select_service_level = "ok"
		else select_service_level = "error"
	}
</script>

<style>
	/* .inputbox {
		max-width: 100px;
	} */
</style>

<Box title={$_("config.titles.evse")} icon="mdi:evse" back={true}>
	<div class="columns is-centered">
		<div class="column is-two-thirds">
			<div class="my-2 is-flex is-justify-content-center" >
				<Borders grow={true}>
					<div class="has-text-weight-bold is-size-6">{$_("config.evse.maxcur")}</div>
					<SliderForm icon="fa6-solid:gauge-high" bind:value={$config_store.max_current_soft} unit={$_("units.A")} min={$config_store.min_current_hard?$config_store.min_current_hard:6} max={$config_store.max_current_hard?$config_store.max_current_hard:32} onchange={setMaxCurrent} />
				</Borders>
			</div>
			<div class="mt-4 mb-3 is-flex is-justify-content-center" >
				<Borders grow={true} has_help={true}>
					<div slot="help">
						{@html $_("config.evse.random-help")}
					</div>
					<div class="has-text-weight-bold is-size-6">{$_("config.evse.random")}</div>
					<div class="is-flex is-justify-content-center is-align-items-center">
						<div class="inputbox">	
							<InputForm is_inline={true} type="number" min=0 max=3600  bind:value={$config_store.scheduler_start_window} 
							bind:status={input_random_start} onChange={()=>onChange("scheduler_start_window", $config_store.scheduler_start_window)}/>
						</div>
						<div class="ml-2 is-inline-block"> {$_("config.evse.seconds")}</div>
					</div>
				</Borders>
			</div>
		</div>	
	</div>
</Box>