<script>
	import Slider from "../ui/SliderForm.svelte";
	import Switch from "../ui/SwitchForm.svelte";
	import InputHalf from "../ui/InputHalfForm.svelte";

	let man_data = {
		shaper: {
			state: true,
		},
		divert: {
			state: false,
		},
		max_current: 32,
		time_lmt: null,
		charge_lmt: null,
	}
	let conf_data = {
		current_shaper_enabled: true,
		divert_enabled: true
	}
</script>


<div>	
	<div class="is-size-4 has-text-weight-bold">Manual</div>
	<button class="button mt-3 is-primary has-tooltip-arrow has-tooltip" data-tooltip="Enable charging">Enable Charge</button>
	<div>
		<Slider id="man_max_cur" label="Max Current" tooltip="Override max current" unit="A" min=6 max=32 step=1 bind:value={man_data.max_current} />
		<div class="columns is-mobile">
			<div class="column is-half {!conf_data.current_shaper_enabled?"is-hidden":""}">
				<Switch name="man-swShaper" label="Current Shaper" bind:checked={man_data.shaper.state} tooltip={man_data.shaper.state?"Disable Current Shaper":"Enable Current Shaper"} />
			</div>
			<div class="column is-half {!conf_data.divert_enabled?"is-hidden":""}">
				<Switch name="man-swDivert" label="Eco/Divert" bind:checked={man_data.divert.state} tooltip={man_data.divert.state?"Disable Eco / Solar Divert mode":"Enable Eco / Solar Divert mode"} />
			</div>
		</div>

		<div class="columns is-mobile">
				<InputHalf label="Time Limit" value={man_data.time_lmt} type="number" placeholder="in minutes" />
				<InputHalf label="Charge Limit" value={man_data.charge_lmt} type="number
				" placeholder="in kWh" />			
		</div>
	</div>
</div>