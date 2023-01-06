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

	let input_random_start = 0
	let select_service_level = ""
	const service_items = [{name: "Auto", value: 0},{name: "Level 1", value: 1},{name: "Level 2", value: 2}]

	async function onChange(prop,val) {
		input_random_start = 1
		let res = await serialQueue.add(()=>config_store.saveParam(prop, val))
		if (await res) {
			input_random_start= 2 //ok
		}
		else input_random_start = 3 //error
		return res
	}

	async function setMaxCurrent() {
		let res = await serialQueue.add(()=>config_store.saveParam("max_current_soft",$config_store.max_current_soft))
	}
	async function setLed() {
		let res = await serialQueue.add(()=>config_store.saveParam("led_brightness",$config_store.led_brigthness))
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
	.inputbox {
		max-width: 100px;
	}
</style>

<Box title={$_("config.titles.evse")} icon="mdi:evse" back={true}>
	<div class="is-flex is-flex-direction-column is-align-items-center mt-4 " back={true}>

		<Borders>
			<div class="has-text-weight-bold is-size-6">{$_("config.evse.maxcur")}</div>
			<SliderForm icon="fa6-solid:gauge-high" bind:value={$config_store.max_current_soft} unit={$_("units.A")} min={$config_store.min_current_hard?$config_store.min_current_hard:6} max={$config_store.max_current_hard?$config_store.max_current_hard:32} onchange={setMaxCurrent} />
		</Borders>
		<Borders>
			<div class="has-text-weight-bold is-size-6">{$_("config.evse.random")}</div>
			<div class="is-flex is-justify-content-center">
				<div class="inputbox">	
					<InputForm  type="number" title="" bind:value={$config_store.scheduler_start_window} 
					status={input_random_start} onChange={()=>onChange("scheduler_start_window", $config_store.scheduler_start_window)}/>
				</div>
			</div>
			
			<div class="ml-2"> {$_("config.evse.seconds")}</div>
		</Borders>
		<Borders>
			<div class="has-text-weight-bold is-size-6">{$_("config.evse.service")}</div>
			<Select bind:value={$config_store.service} bind:status={select_service_level} items={service_items} onChange={setServiceLevel}/>
		</Borders>

		<Borders>
			<Help>{@html $_("config.evse.random-help")}</Help>
			<div class="has-text-weight-bold is-size-6">{$_("config.evse.pause")}</div>
			<Switch name="pausemode" label="{$config_store.pause_uses_disabled?"Disable":"Sleep"}" bind:checked={$config_store.pause_uses_disabled} onChange={togglePauseMode}  />
		</Borders>
		<Borders>
			<div class="has-text-weight-bold is-size-6">{$_("config.evse.led-bn")}</div>
			<SliderForm icon="ic:outline-light-mode" bind:value={$config_store.led_brightness} min=0 max=255 onchange={setLed} />
		</Borders>
	</div>

</Box>