<script>
	import Slider from "../ui/SliderForm.svelte"
	import Switch from "../ui/SwitchForm.svelte"
	import InputHalf from "../ui/InputHalfForm.svelte"
	import ButtonManual from "../ui/ManualButton.svelte"
	import {config_store} from "../../lib/stores/config.js"
	import {claim_store} from "../../lib/stores/claim.js"
	import {states_store} from "../../lib/stores/states.js"



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

	async function setMaxCurrent(val) {
		
		if (val == $config_store.max_current_soft) {
			//release claim
			let res = await claim_store.releaseClaim()
			$states_store.settings.max_current = val
			return res
		}
		else {
			// set claim
			$claim_store.max_current = val
			let res = await claim_store.setClaim($claim_store)
			$states_store.settings.max_current = val
			return res
		}
	}

	const getMaxCurrent = () => {
		console.log("get max current " )
		if ($claim_store.max_current)
			return $claim_store.max_current
		else if ($config_store.max_current_soft)
			return $config_store.max_current_soft
	}


</script>


<div>	
	<div class="is-size-4 has-text-weight-bold">Manual</div>
	<ButtonManual mode=0/>
	<div>
		{#if $states_store.data.loaded == true}
		{$states_store.settings.max_current = getMaxCurrent()}
		<Slider  id="man_max_cur" label="Max Current" tooltip="Override max current" unit="A" min=6 max={$config_store.max_current_soft} step=1 value={$states_store.settings.max_current} onchange={(value) => setMaxCurrent(value)} />
		{/if}	
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