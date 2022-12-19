<script>
	import Borders from "./../../ui/Borders.svelte";
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
		max-width: 200px;
	}
</style>

<Box title="EVSE" icon="mdi:evse">
	<div class="is-flex is-flex-direction-column is-align-items-center mt-4 ">

		<Borders>
			<div class="has-text-weight-bold is-size-6">Max Current</div>
			<SliderForm icon="fa6-solid:gauge-high" bind:value={$config_store.max_current_soft} unit="A" min={$config_store.min_current_hard}} max={$config_store.max_current_hard} onchange={setMaxCurrent} />
		</Borders>
		<Borders>
			<div class="has-text-weight-bold is-size-6">Scheduler Random start adjust</div>
			<div class="is-flex is-align-items-center">	
				<div class="inputbox ">	
				<InputForm  type="number" title="" placeholder="OpenEVSE host name" bind:value={$config_store.scheduler_start_window} 
				status={input_random_start} onChange={()=>onChange("scheduler_start_window", $config_store.scheduler_start_window)}/>
				</div>
				<div class="ml-2"> seconds</div>
			</div>
		</Borders>
		<Borders>
			<div class="has-text-weight-bold is-size-6">Service Level</div>
			<Select bind:value={$config_store.service} bind:status={select_service_level} items={service_items} onChange={setServiceLevel}/>
		</Borders>

		<Borders>
			<Help>Some vehicles will shutdown if left in sleep mode (pilot signal enable) and then can not be woken up by timers/PV divert. 
				Changing the pause state to disable should resolve this issue, however this removes the ability for the charger to detect
					if a vehicle is connected when paused.
			</Help>
			<div class="has-text-weight-bold is-size-6">Pause Status</div>
			<Switch name="pausemode" label="{$config_store.pause_uses_disabled?"Disable":"Sleep"}" bind:checked={$config_store.pause_uses_disabled} onChange={togglePauseMode}  />
		</Borders>
		<Borders>
			<div class="has-text-weight-bold is-size-6">Led Brightness</div>
			<SliderForm icon="ic:outline-light-mode" bind:value={$config_store.led_brightness} min=0 max=255 onchange={setLed} />
		</Borders>
	</div>

</Box>