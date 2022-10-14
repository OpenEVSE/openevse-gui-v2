<script>
	import Slider from "../ui/SliderForm.svelte"
	import Switch from "../ui/SwitchForm.svelte"
	import InputHalf from "../ui/InputHalfForm.svelte"
	import ButtonManual from "../ui/ManualButton.svelte"
	import {status_store} from "../../lib/stores/status.js"
	import {config_store} from "../../lib/stores/config.js"
	import {claims, override} from "../../lib/api.js"
	import {onMount} from "svelte"

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

	let max_current




	async function setMaxCurrent(val) {
		if (val == $config_store.max_current_soft) {
			//release claim
			let res = await claims.releaseClaim()
			console.log(res)
		}
		else {
			// set claim
			let data = {max_current: val}
			let res = await claims.setClaim(data)
			console.log(res)
		}
		max_current = val
	}

	async function getMaxCurrent(def) {
		let res = await claims.getClaim()
		
		if (res.max_current)
			max_current = res.max_current
		else max_current = def
		console.log(max_current)
	}



</script>


<div>	
	<div class="is-size-4 has-text-weight-bold">Manual</div>
	<ButtonManual mode=0/>
	<div>
		{#await getMaxCurrent($config_store.max_current_soft)}
		<Slider id="man_max_cur" label="Max Current" tooltip="Override max current" unit="A" min=6 max={$config_store.max_current_soft} step=1 bind:value={$config_store.max_current_soft} onchange={(value) => setMaxCurrent(value)} />
		{:then}
		<Slider id="man_max_cur" label="Max Current" tooltip="Override max current" unit="A" min=6 max={$config_store.max_current_soft} step=1 bind:value={max_current} onchange={(value) => setMaxCurrent(value)} />
		{/await}
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