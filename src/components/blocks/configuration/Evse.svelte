<script>
	import Help from "./../../ui/Help.svelte";
	import Switch from "./../../ui/Switch.svelte";
	import { serialQueue } from "./../../../lib/queue.js";
	import SliderForm from "./../../ui/SliderForm.svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import InputForm from "./../../ui/InputForm.svelte";
	import Button from "./../../ui/Button.svelte";
	import Box from "./../../ui/Box.svelte";

	// let input_random_start = {value: 0}
	let input_random_start = 0

	async function onChange(prop,val) {
		input_random_start = 1
		let res = await config_store.saveParam(prop, val)
		if (res) {
			input_random_start= 2 //ok
		}
		else input_random_start = 3 //error
		return res
	}

	async function setLed() {
		let res = serialQueue.add(()=>config_store.saveParam("led_brightness",$config_store.led_brigthness))
	}

	async function togglePauseMode() {
		let res = serialQueue.add(()=>config_store.saveParam("pause_uses_disabled",$config_store.pause_uses_disabled))
	}
</script>
<style>
	.inputbox {
		max-width: 200px;
	}

	.borders {
		border-radius: 10px;
		border: 1px solid rgb(50, 179, 212);
		width: 70%;
		padding: 20px;
	}

</style>
<Box title="EVSE" icon="mdi:evse">
	<div class="is-flex is-flex-direction-column is-align-items-center mt-4 ">
			<div class="borders mb-4">
				<div class="has-text-weight-bold is-size-6">Scheduler Random start adjust</div>
				<div class="is-flex is-align-items-center">	
					<div class="inputbox ">	
					<InputForm  type="number" title="" placeholder="OpenEVSE host name" bind:value={$config_store.scheduler_start_window} 
					status={input_random_start} onChange={()=>onChange("scheduler_start_window", $config_store.scheduler_start_window)}/>
					</div>
					<div class="ml-2"> seconds</div>
				</div>
			</div>
			
			<div class="borders mb-4">
				<div class="has-text-weight-bold is-size-6">Led Brightness</div>
				<SliderForm bind:value={$config_store.led_brightness} min=0 max=255 onchange={setLed} />
			</div>
			<div class="borders">
				<Help>Some vehicles will shutdown if left in sleep mode (pilot signal enable) and then can not be woken up by timers/PV divert. 
					Changing the pause state to disable should resolve this issue, however this removes the ability for the charger to detect
					 if a vehicle is connected when paused.
				</Help>
				<div class="has-text-weight-bold is-size-6">Pause Status</div>
				<Switch name="pausemode" label="{$config_store.pause_uses_disabled?"Disable":"Sleep"}" bind:checked={$config_store.pause_uses_disabled} onChange={togglePauseMode}  />
			</div>
	</div>

</Box>